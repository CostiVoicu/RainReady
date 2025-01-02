import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { ForecastData } from '../types/forecast';

interface ForecastItemProps {
    forecast: ForecastData;
    unit: 'metric' | 'imperial';
}

const ForecastItem: React.FC<ForecastItemProps> = ({ forecast, unit }) => {
    const temp = Math.round(forecast.main.temp);
    const unitSymbol = unit === 'metric' ? '°C' : '°F';
    const time = new Date(forecast.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const iconUrl = `http://openweathermap.org/img/w/${forecast.weather[0].icon}.png`;
    const description = forecast.weather[0].description;

    return (
        <View style={styles.container}>
            <Text>{time}</Text>
            <Image
                style={styles.icon}
                source={{ uri: iconUrl }}
                onError={() => <Text>Icon unavailable</Text>}
                accessibilityLabel={description}
            />
            <Text>{temp}{unitSymbol}</Text>
            {description && <Text style={styles.description}>{description}</Text>}
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
    description: {
        fontSize: 12,
        fontStyle: 'italic',
    },
});

export default ForecastItem;
