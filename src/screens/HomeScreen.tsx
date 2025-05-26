import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { useListStore } from '../store/listStore';
import GroceryListCard from '../components/GroceryListCard';
import SearchBar from '../components/SearchBar';

export default function HomeScreen({ navigation }: any) {
  const { lists, fetchLists, createList, isLoading } = useListStore();
  const [searchQuery, setSearchQuery] = useState('');

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

  const renderEmptyState = () => (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
      <h2 className="text-xl font-semibold text-gray-900 mb-2">No grocery lists yet</h2>
      <p className="text-gray-500 mb-6">
        Create your first grocery list to get started.
      </p>
      <button
        onClick={() => createList()}
        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <Plus className="h-4 w-4 mr-2" />
        Create New List
      </button>
    </div>
  );

  const renderSection = (title: string, data: any[], isLast = false) => {
    if (data.length === 0) return null;

    return (
      <div className={`mb-8 ${isLast ? 'mb-0' : ''}`}>
        <h2 className="text-lg font-medium text-gray-900 mb-3">{title}</h2>
        <div className="space-y-3">
          {data.map((item) => (
            <GroceryListCard
              key={item.id}
              list={item}
              onPress={() =>
                navigation.navigate('ListDetail', { listId: item.id })
              }
            />
          ))}
        </div>
      </div>
    );
  };

  if (lists.length === 0 && !isLoading) {
    return (
      <div className="container mx-auto p-4 max-w-2xl">
        <SearchBar onSearch={setSearchQuery} />
        {renderEmptyState()}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <SearchBar onSearch={setSearchQuery} />
      <div className="space-y-8 mt-4">
        {renderSection('Active Lists', activeLists)}
        {renderSection('Completed', completedLists, true)}
      </div>
    </div>
  );
}