import React, { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { View, Text, StyleSheet, ActivityIndicator, Platform, Button } from 'react-native';
import { WeatherData } from '../types/weather';
import CurrentWeather from '../components/CurrentWeather';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorDisplay from '../components/ErrorDisplay';


Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

const HomeScreen = () => {
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [city, setCity] = useState<string | null>(null);
    const [lastTemperature, setLastTemperature] = useState<number | null>(null);
    const [lastRainStatus, setLastRainStatus] = useState(false);

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
                    setCity(address[0].city);
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
        registerForPushNotificationsAsync();
    }, []);

    useEffect(() => {
        const scheduleNotifications = async () => {
            if (weatherData) {
                if (lastTemperature !== null && Math.abs(weatherData.main.temp - lastTemperature) >= 5) {
                    Notifications.scheduleNotificationAsync({
                        content: {
                            title: "Be careful of temperature changes!",
                            body: `The temperature varied with ${Math.abs(weatherData.main.temp - lastTemperature)}°C.`,
                        },
                        trigger: null,
                    });
                }
                setLastTemperature(weatherData.main.temp);

                const currentRainStatus = weatherData.weather.some(condition => condition.main.toLowerCase() === 'rain' || condition.main.toLowerCase() === 'drizzle' || condition.main.toLowerCase() === 'thunderstorm');
                if (lastRainStatus !== currentRainStatus) {
                    Notifications.scheduleNotificationAsync({
                        content: {
                            title: currentRainStatus ? "The rain has started!" : "The rain has stopped!",
                            body: currentRainStatus ? "Don't forget your umbrella!" : "The sun is out!",
                        },
                        trigger: null,
                    });
                }
                setLastRainStatus(currentRainStatus);
            }
        };
        scheduleNotifications();
    }, [weatherData, lastTemperature, lastRainStatus]);


    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <ErrorDisplay message={error} />;
    }

    if (!weatherData) {
        return <View style={styles.centered}><Text>No weather data is available.</Text></View>;
    }

    return (
        <View style={styles.container}>
            <CurrentWeather weather={weatherData} city={city} />
            <Button title="Test Immediate Notification" onPress={() => { Notifications.scheduleNotificationAsync({ content: { title: "test", body: "test" }, trigger: null }) }} />
        </View>
    );
};

async function registerForPushNotificationsAsync() {
    let token;
    if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }
    if (finalStatus !== 'granted') {
        alert('Could not get push notification token!');
        return;
    }
    token = await Notifications.getExpoPushTokenAsync();
    return token;
}

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
});

export default HomeScreen;
