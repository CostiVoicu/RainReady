import React from 'react';
import { Image, StyleSheet } from 'react-native';

interface WeatherIconProps {
    iconCode: string;
}

const WeatherIcon: React.FC<WeatherIconProps> = ({ iconCode }) => {
    const iconUrl = `http://openweathermap.org/img/w/${iconCode}.png`;

    return <Image style={styles.icon} source={{ uri: iconUrl }} />;
};

const styles = StyleSheet.create({
    icon: {
        width: 100,
        height: 100
    }
})

export default WeatherIcon;
