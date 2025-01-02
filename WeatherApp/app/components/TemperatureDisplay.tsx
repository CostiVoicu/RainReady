import React from 'react';
import { Text, StyleSheet } from 'react-native';

interface TemperatureDisplayProps {
    temperature: number;
}

const TemperatureDisplay: React.FC<TemperatureDisplayProps> = ({ temperature }) => {
    const roundedTemp = Math.round(temperature);
    return <Text style={styles.temperature}>{roundedTemp}°C</Text>;
};

const styles = StyleSheet.create({
    temperature: {
        fontSize: 48,
        fontWeight: 'bold',
        marginBottom: 10,
    },
});

export default TemperatureDisplay;
