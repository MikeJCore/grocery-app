import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Search, X } from '@expo/vector-icons/Feather';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = React.useState('');

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <View style={styles.container}>
      <Search size={18} color="#9CA3AF" style={styles.searchIcon} />
      <TextInput
        style={styles.input}
        value={query}
        onChangeText={(text) => {
          setQuery(text);
          onSearch(text);
        }}
        placeholder="Search lists..."
        placeholderTextColor="#9CA3AF"
      />
      {query ? (
        <X
          size={18}
          color="#9CA3AF"
          style={styles.clearIcon}
          onPress={handleClear}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },
  clearIcon: {
    padding: 4,
  },
});