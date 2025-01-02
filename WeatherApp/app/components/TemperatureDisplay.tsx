import React from 'react';
import { Text, StyleSheet } from 'react-native';

interface TemperatureDisplayProps {
    temperature: number;
    unit: 'metric' | 'imperial';
}

const TemperatureDisplay: React.FC<TemperatureDisplayProps> = ({temperature, unit, }) => {
    const roundedTemp = Math.round(temperature);
    const displayUnit = unit === 'metric' ? '°C' : '°F';

    return <Text style={styles.temperature}>{roundedTemp}{displayUnit}</Text>;
};

const styles = StyleSheet.create({
    temperature: {
        fontSize: 48,
        fontWeight: 'bold',
        marginBottom: 10,
    },
});

export default TemperatureDisplay;
