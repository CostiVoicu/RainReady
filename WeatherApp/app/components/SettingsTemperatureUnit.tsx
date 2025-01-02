import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface SettingsTemperatureUnitProps {
    unit: 'metric' | 'imperial';
    onUnitChange: (unit: 'metric' | 'imperial') => void;
}

const SettingsTemperatureUnit: React.FC<SettingsTemperatureUnitProps> = ({ unit, onUnitChange }) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={[styles.unitButton, unit === 'metric' && styles.selectedUnit]}
                onPress={() => onUnitChange('metric')}
            >
                <Text style={styles.unitText}>°C</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.unitButton, unit === 'imperial' && styles.selectedUnit]}
                onPress={() => onUnitChange('imperial')}
            >
                <Text style={styles.unitText}>°F</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    unitButton: {
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginHorizontal: 5,
    },
    selectedUnit: {
        backgroundColor: '#ddd',
    },
    unitText: {
        fontSize: 16,
    },
});

export default SettingsTemperatureUnit;
