import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { useListStore } from '../store/listStore';
import GroceryListCard from '../components/grocery/GroceryListCard';
import SearchBar from '../components/grocery/SearchBar';
import EditListNameForm from '../components/grocery/EditListNameForm';
import { GroceryList } from '../types';

const HomePage: React.FC = () => {
  const { lists, fetchLists, createList, createYesterdaysList, isLoading } = useListStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [showEditListNameForm, setShowEditListNameForm] = useState(false);
  const [listToEdit, setListToEdit] = useState<GroceryList | null>(null);
  
  useEffect(() => {
    fetchLists();
  }, [fetchLists]);
  
  const filteredLists = searchQuery
    ? lists.filter(list => 
        list.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : lists;
  
  const activeLists = filteredLists.filter(list => !list.is_completed);
  const completedLists = filteredLists.filter(list => list.is_completed);

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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Grocery Lists</h1>
        <button
          onClick={() => createList()}
          disabled={isLoading}
          className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
        >
          <Plus size={18} className="mr-1" />
          New List
        </button>
      </div>
      
      <SearchBar onSearch={setSearchQuery} />
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-pulse text-gray-500">Loading lists...</div>
        </div>
      ) : (
        <>
          {filteredLists.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <h3 className="text-lg font-medium text-gray-700 mb-2">No grocery lists yet</h3>
              <p className="text-gray-500 mb-4">
                Create your first grocery list to get started.
              </p>
              <button
                onClick={() => createList()}
                className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
              >
                <Plus size={18} className="mr-1" />
                Create New List
              </button>
            </div>
          ) : (
            <>
              {activeLists.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-lg font-semibold text-gray-700 mb-3">Active Lists</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {activeLists.map(list => (
                      <GroceryListCard 
                        key={list.id} 
                        list={list} 
                        onEditName={handleEditListName}
                      />
                    ))}
                  </div>
                </div>
              )}
              
              {completedLists.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-700 mb-3">Completed Lists</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {completedLists.map(list => (
                      <GroceryListCard 
                        key={list.id} 
                        list={list}
                        onEditName={handleEditListName}
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
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

export default HomePage;