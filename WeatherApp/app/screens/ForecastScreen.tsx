import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { ForecastData } from '../types/forecast';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorDisplay from '../components/ErrorDisplay';
import SearchBar from "../components/SearchBar";
import ForecastGroup from "../components/ForecastGroup";
import {useSettings} from "../context/SettingsContent";
import {useFocusEffect} from "@react-navigation/native";

const ForecastScreen = () => {
    const [forecastData, setForecastData] = useState<ForecastData[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [city, setCity] = useState<string>('Brasov');
    const { settings } = useSettings();

    useFocusEffect(
        React.useCallback(() => {
            fetchForecast(city);
        }, [city, settings.temperatureUnit])
    )

    const fetchForecast = async (cityName: string) => {
        setLoading(true);
        setError(null);
        try {
            const units = settings.temperatureUnit === 'metric' ? 'metric' : 'imperial';
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=82a111975d27d92374d1553c50bc4a0a&units=${units}`
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
            <SearchBar city={city} onChangeCity={setCity} handleSearch={handleSearch} />
            <FlatList
                data={groupedForecasts}
                renderItem={({ item }) => <ForecastGroup group={item} />}
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
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
});

export default ForecastScreen;
