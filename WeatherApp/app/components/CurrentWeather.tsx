import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WeatherData } from '../types/weather';
import WeatherIcon from './WeatherIcon';
import TemperatureDisplay from './TemperatureDisplay';

interface CurrentWeatherProps {
    weather: WeatherData;
    city: string | null; // Add city prop
}

const CurrentWeather: React.FC<CurrentWeatherProps> = ({ weather, city }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.city}>{city}</Text>
            <WeatherIcon iconCode={weather.weather[0].icon} />
            <Text style={styles.description}>{weather.weather[0].description}</Text>
            <TemperatureDisplay temperature={weather.main.temp} />
            <Text style={styles.feelsLike}>
                Feels like: {Math.round(weather.main.feels_like)}°C
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
