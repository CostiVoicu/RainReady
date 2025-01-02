import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Button } from 'react-native';
import { ForecastData } from '../types/forecast';
import ForecastItem from '../components/ForecastItem';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorDisplay from '../components/ErrorDisplay';

const ForecastScreen = () => {
    const [forecastData, setForecastData] = useState<ForecastData[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [city, setCity] = useState<string>('Brasov'); 

    const fetchForecast = async (cityName: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=82a111975d27d92374d1553c50bc4a0a&units=metric`
            );
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error(`City not found`);
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setForecastData(data.list);
        } catch (err: any) {
            setError(err.message);
            console.error("Error fetching forecast:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchForecast(city);
    }, []);

    const handleSearch = () => {
        if (city.trim() !== '') {
            fetchForecast(city.trim());
        } else {
            setError("Please enter a city name.");
        }
    };

    const groupForecastsByDay = (forecasts: ForecastData[]) => {
        const grouped: { [key: string]: { date: string; forecasts: ForecastData[] } } = {};
        forecasts.forEach(forecast => {
            const date = new Date(forecast.dt * 1000).toLocaleDateString();
            if (!grouped[date]) {
                grouped[date] = { date, forecasts: [] };
            }
            grouped[date].forecasts.push(forecast)
        });
        return Object.values(grouped);
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <ErrorDisplay message={error} />;
    }

    if (!forecastData || forecastData.length === 0) {
        return <View style={styles.centered}><Text>No forecast data available.</Text></View>;
    }

    const groupedForecasts = groupForecastsByDay(forecastData);

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Enter city name"
                    value={city}
                    onChangeText={setCity}
                />
                <Button title="Search" onPress={handleSearch} />
            </View>
            <FlatList
                data={groupedForecasts}
                renderItem={({ item }) => (
                    <View>
                        <Text style={styles.dayHeader}>{item.date}</Text>
                        <FlatList
                            data={item.forecasts}
                            renderItem={({ item: forecast }) => <ForecastItem forecast={forecast} />}
                            keyExtractor={(item, index) => index.toString()}
                            horizontal
                        />
                    </View>
                )}
                keyExtractor={(item, index) => index.toString()}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    dayHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 5,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 8,
        marginRight: 10,
    },
});

export default ForecastScreen;
