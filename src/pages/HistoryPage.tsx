import React, { useEffect, useState } from 'react';
import { useListStore } from '../store/listStore';
import GroceryListCard from '../components/grocery/GroceryListCard';
import SearchBar from '../components/grocery/SearchBar';
import { History } from 'lucide-react';
import EditListNameForm from '../components/grocery/EditListNameForm';
import { GroceryList } from '../types';

const HistoryPage: React.FC = () => {
  const { lists, fetchLists, isLoading } = useListStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [showEditListNameForm, setShowEditListNameForm] = useState(false);
  const [listToEdit, setListToEdit] = useState<GroceryList | null>(null);
  
  useEffect(() => {
    fetchLists();
  }, [fetchLists]);
  
  // Only show completed lists
  const completedLists = lists.filter(list => list.is_completed);
  
  const filteredLists = searchQuery
    ? completedLists.filter(list => 
        list.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : completedLists;

  const handleEditListName = (list: GroceryList) => {
    setListToEdit(list);
    setShowEditListNameForm(true);
  };

  const handleCloseEditForm = () => {
    setShowEditListNameForm(false);
    setListToEdit(null);
  };
  
  return (
    <div>
      <div className="flex items-center mb-6">
        <History className="h-6 w-6 text-emerald-600 mr-2" />
        <h1 className="text-2xl font-bold text-gray-800">Shopping History</h1>
      </div>
      
      <SearchBar onSearch={setSearchQuery} />
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-pulse text-gray-500">Loading history...</div>
        </div>
      ) : (
        <>
          {filteredLists.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <h3 className="text-lg font-medium text-gray-700 mb-2">No shopping history yet</h3>
              <p className="text-gray-500">
                Complete a shopping trip to see it in your history.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredLists.map(list => (
                <GroceryListCard 
                  key={list.id} 
                  list={list} 
                  onEditName={handleEditListName}
                />
              ))}
            </div>
          )}
        </>
      )}

      {showEditListNameForm && listToEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[1000] modal-overlay">
          <div className="max-w-md w-full modal-content">
            <EditListNameForm
              list={listToEdit}
              onClose={handleCloseEditForm}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryPage;