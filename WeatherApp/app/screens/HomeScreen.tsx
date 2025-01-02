import * as Location from 'expo-location';
import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Platform } from 'react-native';
import { WeatherData } from '../types/weather';
import CurrentWeather from '../components/CurrentWeather';

const HomeScreen = () => {
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [city, setCity] = useState<string | null>(null);

    useEffect(() => {
        const getLocation = async () => {
            try {
                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    setError('Permission to access location was denied.');
                    return;
                }

                let location = await Location.getCurrentPositionAsync({});
                const { latitude, longitude } = location.coords;
                fetchWeather(latitude, longitude);

                let address = await Location.reverseGeocodeAsync({
                    latitude,
                    longitude,
                });

                if (address && address.length > 0) {
                    setCity(address[0].city); // Extract city name
                } else {
                    setCity("Unknown Location");
                }
            } catch (error) {
                setError("Could not get location.");
                console.error("Error getting location:", error);
            }
        };

        const fetchWeather = async (latitude: number, longitude: number) => {
            try {
                const response = await fetch(
                    `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=82a111975d27d92374d1553c50bc4a0a&units=metric`
                );
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setWeatherData(data);
            } catch (err) {
                setError("Could not load weather data.");
                console.error("Error fetching weather:", err);
            } finally {
                setLoading(false);
            }
        };
        getLocation();
    }, []);

    if (loading) {
        return <View style={styles.centered}><ActivityIndicator size="large" color="#0000ff" /></View>;
    }

    if (error) {
        return <View style={styles.centered}><Text style={styles.errorText}>{error}</Text></View>;
    }

    if (!weatherData) {
        return <View style={styles.centered}><Text>No weather data available.</Text></View>;
    }

    return (
        <View style={styles.container}>
            <CurrentWeather weather={weatherData} city={city}/>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginTop: 20
    }
});

export default HomeScreen;
