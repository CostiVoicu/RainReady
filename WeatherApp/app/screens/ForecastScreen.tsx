import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import * as SQLite from 'expo-sqlite';
import NetInfo from "@react-native-community/netinfo";
import { ForecastData } from '../types/forecast';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorDisplay from '../components/ErrorDisplay';
import SearchBar from "../components/SearchBar";
import ForecastGroup from "../components/ForecastGroup";
import { useSettings } from "../context/SettingsContent";
import { useNavigation } from "@react-navigation/native";

const db = SQLite.openDatabaseSync('forecasts.db');

interface DatabaseForecast {
    data: string;
    unit: string;
}

const ForecastScreen = () => {
    const [forecastData, setForecastData] = useState<ForecastData[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [city, setCity] = useState<string>('');
    const [isOnline, setIsOnline] = useState<boolean>(true);
    const { settings } = useSettings();
    const navigation = useNavigation();

    useEffect(() => {
        const unsubscribe = navigation.addListener('blur', () => {
            setForecastData(null);
            setCity('');
            setError(null);
        });

        return unsubscribe;
    }, [navigation]);

    useEffect(() => {
        const initDb = async () => {
            try {
                await db.execAsync(
                    'CREATE TABLE IF NOT EXISTS forecasts (id INTEGER PRIMARY KEY AUTOINCREMENT, city TEXT, data TEXT, timestamp INTEGER, unit TEXT);'
                );
                console.log('Database and table created successfully');
            } catch (error) {
                console.error('Error creating table:', error);
            }
        };
        initDb();
    }, []);

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            setIsOnline(state.isConnected ?? false);
        });

        return () => unsubscribe();
    }, []);

    const saveForecastToDb = async (cityName: string, data: ForecastData[], unit: string) => {
        try {
            await db.execAsync(`DELETE FROM forecasts WHERE city = '${cityName}'`);
            const jsonData = JSON.stringify(data).replace(/'/g, "''");
            await db.execAsync(
                `INSERT INTO forecasts (city, data, timestamp, unit) VALUES ('${cityName}', '${jsonData}', ${Date.now()}, '${unit}')`
            );
        } catch (error) {
            console.error('Error saving forecast:', error);
        }
    };

    const convertTemperature = (temp: number, currentUnit: string, targetUnit: string): number => {
        if (currentUnit === targetUnit) {
            return temp;
        }

        if (currentUnit === 'metric' && targetUnit === 'imperial') {
            return (temp * 9 / 5) + 32;
        } else if (currentUnit === 'imperial' && targetUnit === 'metric') {
            return (temp - 32) * 5 / 9;
        }
        return temp; // Or throw an error for invalid unit combinations
    };

    const getForecastFromDb = async (cityName: string): Promise<ForecastData[] | null> => {
        try {
            const result = await db.getFirstAsync<DatabaseForecast>(
                `SELECT data, unit FROM forecasts WHERE city = '${cityName}'`
            );

            if (result) {
                let forecastData: ForecastData[] = JSON.parse(result.data);
                const storedUnit = result.unit;

                if (storedUnit !== settings.temperatureUnit) {
                    forecastData = forecastData.map(forecast => ({
                        ...forecast,
                        main: {
                            ...forecast.main,
                            temp: convertTemperature(forecast.main.temp, storedUnit, settings.temperatureUnit),
                            feels_like: convertTemperature(forecast.main.feels_like, storedUnit, settings.temperatureUnit),
                            temp_min: convertTemperature(forecast.main.temp_min, storedUnit, settings.temperatureUnit),
                            temp_max: convertTemperature(forecast.main.temp_max, storedUnit, settings.temperatureUnit),
                        },
                    }));
                }
                return forecastData;
            }
            return null;
        } catch (error) {
            return null;
        }
    };

    const fetchForecast = async (cityName: string) => {
        setLoading(true);
        setError(null);

        try {
            if (isOnline) {
                const units = settings.temperatureUnit === 'metric' ? 'metric' : 'imperial';
                const cityNameEncoded = encodeURIComponent(cityName);
                const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityNameEncoded}&appid=82a111975d27d92374d1553c50bc4a0a&units=${units}`;
                const response = await fetch(apiUrl);

                if (!response.ok) {
                    if (response.status === 404) {
                        throw new Error(`City not found`);
                    }
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setForecastData(data.list);
                await saveForecastToDb(cityName, data.list, units);
            } else {
                const savedData = await getForecastFromDb(cityName);
                if (savedData) {
                    setForecastData(savedData);
                } else {
                    throw new Error('No offline data available for this city');
                }
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        if (city.trim() !== '') {
            fetchForecast(city.trim());
        } else {
            setError("Please enter a city name.");
        }
    };

    const groupForecastsByDay = (forecasts: ForecastData[]): { date: string; forecasts: ForecastData[] }[] => {
        const grouped: { [key: string]: { date: string; forecasts: ForecastData[] } } = {};
        forecasts.forEach(forecast => {
            const date = new Date(forecast.dt * 1000).toLocaleDateString();
            if (!grouped[date]) {
                grouped[date] = { date, forecasts: [] };
            }
            grouped[date].forecasts.push(forecast);
        });
        return Object.values(grouped);
    };

    return (
        <View style={styles.container}>
            {!isOnline && (
                <View style={styles.offlineBanner}>
                    <Text style={styles.offlineText}>
                        You are currently offline. Showing saved forecast data.
                    </Text>
                </View>
            )}
            <SearchBar city={city} onChangeCity={setCity} handleSearch={handleSearch} />

            {loading && <LoadingSpinner />}
            {error && <ErrorDisplay message={error} />}
            {!loading && !error && forecastData && forecastData.length > 0 && (
                <FlatList
                    data={groupForecastsByDay(forecastData)}
                    renderItem={({ item }) => <ForecastGroup group={item} />}
                    keyExtractor={(item, index) => index.toString()}
                />
            )}
            {!loading && !error && (!forecastData || forecastData.length === 0) && (
                <View style={styles.centered}><Text>No forecast data available.</Text></View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    offlineBanner: {
        backgroundColor: '#ffeb3b',
        padding: 10,
        marginBottom: 10,
    },
    offlineText: {
        textAlign: 'center',
        color: '#000',
    },
});

export default ForecastScreen;
