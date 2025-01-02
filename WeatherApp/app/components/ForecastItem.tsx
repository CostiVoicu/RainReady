import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { ForecastData } from '../types/forecast';

const ForecastItem: React.FC<{ forecast: ForecastData }> = ({ forecast }) => {
    const time = new Date(forecast.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const iconUrl = `http://openweathermap.org/img/w/${forecast.weather[0].icon}.png`;

    return (
        <View style={styles.container}>
            <Text>{time}</Text>
            <Image style={styles.icon} source={{ uri: iconUrl }} />
            <Text>{Math.round(forecast.main.temp)}°C</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginHorizontal: 10,
    },
    icon: {
        width: 50,
        height: 50,
    },
});

export default ForecastItem;
