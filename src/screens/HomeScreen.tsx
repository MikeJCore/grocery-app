import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  RefreshControl,
} from 'react-native';
import { Plus } from '@expo/vector-icons/Feather';
import { useListStore } from '../store/listStore';
import GroceryListCard from '../components/GroceryListCard';
import SearchBar from '../components/SearchBar';

export default function HomeScreen({ navigation }: any) {
  const { lists, fetchLists, createList, isLoading } = useListStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchLists();
  }, [fetchLists]);

  const filteredLists = searchQuery
    ? lists.filter((list) =>
        list.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : lists;

  const activeLists = filteredLists.filter((list) => !list.is_completed);
  const completedLists = filteredLists.filter((list) => list.is_completed);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await fetchLists();
    setRefreshing(false);
  }, [fetchLists]);

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateTitle}>No grocery lists yet</Text>
      <Text style={styles.emptyStateSubtitle}>
        Create your first grocery list to get started.
      </Text>
      <TouchableOpacity style={styles.createButton} onPress={() => createList()}>
        <Plus size={20} color="white" />
        <Text style={styles.createButtonText}>Create New List</Text>
      </TouchableOpacity>
    </View>
  );

  const renderSection = ({
    title,
    data,
  }: {
    title: string;
    data: typeof lists;
  }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <FlatList
        data={data}
        renderItem={({ item }) => (
          <GroceryListCard
            list={item}
            onPress={() => navigation.navigate('ListDetail', { listId: item.id })}
          />
        )}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => createList()}
          disabled={isLoading}
        >
          <Plus size={20} color="white" />
          <Text style={styles.createButtonText}>New List</Text>
        </TouchableOpacity>
      </View>

      <SearchBar onSearch={setSearchQuery} />

      {filteredLists.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListHeaderComponent={
            <>
              {activeLists.length > 0 &&
                renderSection({ title: 'Active Lists', data: activeLists })}
              {completedLists.length > 0 &&
                renderSection({ title: 'Completed Lists', data: completedLists })}
            </>
          }
          data={[]} // Empty data as we're using ListHeaderComponent
          renderItem={null}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 16,
  },
  createButton: {
    backgroundColor: '#059669',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
  },
  createButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 32,
    marginTop: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
    textAlign: 'center',
  },
});