import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Settings {
    notifications: boolean;
    temperatureUnit: 'metric' | 'imperial';
}

const defaultSettings: Settings = {
    notifications: true,
    temperatureUnit: 'metric'
};

interface SettingsContextProps {
    settings: Settings;
    updateSettings: (newSettings: Partial<Settings>) => void;
}

const SettingsContext = createContext<SettingsContextProps>({
    settings: defaultSettings,
    updateSettings: () => { },
});

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [settings, setSettings] = useState<Settings>(defaultSettings);

    useEffect(() => {
        const loadSettings = async () => {
            try {
                const storedSettings = await AsyncStorage.getItem('userSettings');
                if (storedSettings) {
                    setSettings(JSON.parse(storedSettings));
                }
            } catch (error) {
                console.error("Error loading settings:", error);
            }
        };
        loadSettings();
    }, []);

    const updateSettings = async (newSettings: Partial<Settings>) => {
        try {
            const updatedSettings = { ...settings, ...newSettings };
            await AsyncStorage.setItem('userSettings', JSON.stringify(updatedSettings));
            setSettings(updatedSettings);
        } catch (error) {
            console.error("Error saving settings:", error);
        }
    };

    return (
        <SettingsContext.Provider value={{ settings, updateSettings }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => useContext(SettingsContext);
