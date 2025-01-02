import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WeatherData } from '../types/weather';
import WeatherIcon from './WeatherIcon';
import TemperatureDisplay from './TemperatureDisplay';
import {useSettings} from "../context/SettingsContent";

interface CurrentWeatherProps {
    weather: WeatherData;
    city: string | null;
}

const CurrentWeather: React.FC<CurrentWeatherProps> = ({ weather, city }) => {
    const { settings } = useSettings();
    const feelsLikeTemp = weather.main.feels_like;
    const feelsLikeUnit = settings.temperatureUnit === 'metric' ? '°C' : '°F';
    const feelsLikeDisplayTemp = Math.round(feelsLikeTemp);

    return (
        <View style={styles.container}>
            <Text style={styles.city}>{city}</Text>
            <WeatherIcon iconCode={weather.weather[0].icon} />
            <Text style={styles.description}>{weather.weather[0].description}</Text>
            <TemperatureDisplay
                temperature={weather.main.temp}
                unit={settings.temperatureUnit}
            />
            <Text style={styles.feelsLike}>
                Feels like: {feelsLikeDisplayTemp}{feelsLikeUnit}
            </Text>
            <Text>Humidity: {weather.main.humidity}%</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        padding: 20,
    },
    city: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10
    },
    description: {
        fontSize: 18,
        marginBottom: 10,
        textTransform: 'capitalize',
    },
    feelsLike: {
        fontSize: 16,
        color: 'grey',
    },
});

export default CurrentWeather;
