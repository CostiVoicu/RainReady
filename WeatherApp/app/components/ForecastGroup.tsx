import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { ForecastData } from '../types/forecast';
import ForecastItem from './ForecastItem';

interface ForecastGroupProps {
    group: { date: string; forecasts: ForecastData[] };
}

const ForecastGroup: React.FC<ForecastGroupProps> = ({ group }) => (
    <View>
        <Text style={styles.dayHeader}>{group.date}</Text>
        <FlatList
            data={group.forecasts}
            renderItem={({ item: forecast }) => <ForecastItem forecast={forecast} />}
            keyExtractor={(item, index) => index.toString()}
            horizontal
        />
    </View>
);

const styles = StyleSheet.create({
    dayHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 5,
    },
})

export default ForecastGroup;
