import React from 'react';
import { View, StyleSheet } from 'react-native';
import SettingsLabel from '../components/SettingsLabel';
import SettingsSwitch from '../components/SettingsSwitch';
import SettingsTemperatureUnit from '../components/SettingsTemperatureUnit';
import {useSettings} from "../context/SettingsContent";

const SettingsScreen = () => {
    const { settings, updateSettings } = useSettings();

    const handleNotificationsChange = (value: boolean) => {
        updateSettings({ notifications: value });
    };

    const handleTemperatureUnitChange = (unit: 'metric' | 'imperial') => {
        updateSettings({ temperatureUnit: unit });
    };

    return (
        <View style={styles.container}>
            <View style={styles.settingRow}>
                <SettingsLabel>Enable Notifications</SettingsLabel>
                <SettingsSwitch value={settings.notifications} onValueChange={handleNotificationsChange} />
            </View>

            <View style={styles.settingRow}>
                <SettingsLabel>Temperature Unit</SettingsLabel>
                <SettingsTemperatureUnit unit={settings.temperatureUnit} onUnitChange={handleTemperatureUnitChange} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    settingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
});

export default SettingsScreen;
