import React from 'react';
import { Switch } from 'react-native';

interface SettingsSwitchProps {
    value: boolean;
    onValueChange: (value: boolean) => void;
}

const SettingsSwitch: React.FC<SettingsSwitchProps> = ({ value, onValueChange }) => (
    <Switch value={value} onValueChange={onValueChange} />
);

export default SettingsSwitch;
