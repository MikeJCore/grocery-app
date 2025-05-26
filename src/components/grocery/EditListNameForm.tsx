import React, { useState } from 'react';
import { Edit } from 'lucide-react';
import { GroceryList } from '../../types';
import { useListStore } from '../../store/listStore';

interface EditListNameFormProps {
  list: GroceryList;
  onClose: () => void;
}

const EditListNameForm: React.FC<EditListNameFormProps> = ({ list, onClose }) => {
  const [name, setName] = useState(list.name);
  
  const { updateListName, isLoading } = useListStore();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      return;
    }
    
    try {
      await updateListName(list.id, name);
      onClose();
    } catch (error) {
      console.error('Failed to update list name:', error);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center mb-4">
        <Edit className="h-5 w-5 text-emerald-600 mr-2" />
        <h2 className="text-lg font-semibold">Edit List Name</h2>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="list-name" className="block text-sm font-medium text-gray-700 mb-1">
            List Name
          </label>
          <input
            type="text"
            id="list-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="e.g., Weekly Groceries"
            required
          />
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
          >
            Cancel
          </button>
          
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditListNameForm;