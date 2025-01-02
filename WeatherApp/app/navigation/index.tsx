import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import ForecastScreen from '../screens/ForecastScreen';
import SettingsScreen from "../screens/SettingsScreen";

const Tab = createBottomTabNavigator();

function Navigation() {
    return (
        <Tab.Navigator>
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Forecast" component={ForecastScreen} />
            <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
    );
}

export default Navigation;
