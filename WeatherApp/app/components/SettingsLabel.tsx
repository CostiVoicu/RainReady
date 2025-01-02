import React from 'react';
import { Text, StyleSheet } from 'react-native';

interface SettingsLabelProps {
    children: React.ReactNode;
}

const SettingsLabel: React.FC<SettingsLabelProps> = ({ children }) => (
    <Text style={styles.label}>{children}</Text>
);

const styles = StyleSheet.create({
    label: {
        fontSize: 16,
    },
});

export default SettingsLabel;
