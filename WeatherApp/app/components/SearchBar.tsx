import React from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';

interface SearchBarProps {
    city: string;
    onChangeCity: (text: string) => void;
    handleSearch: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ city, onChangeCity, handleSearch }) => (
    <View style={styles.searchContainer}>
        <TextInput
            style={styles.input}
            placeholder="Enter city name"
            value={city}
            onChangeText={onChangeCity}
        />
        <Button title="Search" onPress={handleSearch} />
    </View>
);

const styles = StyleSheet.create({
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 8,
        marginRight: 10,
    },
});

export default SearchBar;
