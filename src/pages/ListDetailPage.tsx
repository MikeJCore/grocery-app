import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Plus, 
  CheckCircle, 
  Copy, 
  ArrowLeft,
  Calendar,
  ShoppingCart,
  Edit
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { useListStore } from '../store/listStore';
import { useCategoryStore } from '../store/categoryStore';
import CategoryGroup from '../components/grocery/CategoryGroup';
import AddItemForm from '../components/grocery/AddItemForm';
import EditItemForm from '../components/grocery/EditItemForm';
import EditListNameForm from '../components/grocery/EditListNameForm';
import CompleteShoppingForm from '../components/grocery/CompleteShoppingForm';
import { GroceryItem } from '../types';

const ListDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { 
    currentList, 
    items, 
    fetchListItems, 
    toggleItemCheck, 
    moveItemToCategory,
    duplicateList,
    deleteItem
  } = useListStore();
  
  const { categories, fetchCategories } = useCategoryStore();
  
  const [showAddItemForm, setShowAddItemForm] = useState(false);
  const [showEditItemForm, setShowEditItemForm] = useState(false);
  const [showCompleteForm, setShowCompleteForm] = useState(false);
  const [showEditListNameForm, setShowEditListNameForm] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<GroceryItem | null>(null);
  
  useEffect(() => {
    if (id) {
      fetchListItems(id);
    }
    fetchCategories();
  }, [id, fetchListItems, fetchCategories]);
  
  if (!currentList) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-pulse text-gray-500">Loading list...</div>
      </div>
    );
  }
  
  const listItems = items.filter(item => item.list_id === currentList.id);
  
  const itemsByCategory: Record<string, GroceryItem[]> = {};
  
  // Initialize categories
  categories.forEach(category => {
    itemsByCategory[category.name] = [];
  });
  
  // Group items by category
  listItems.forEach(item => {
    if (itemsByCategory[item.category]) {
      itemsByCategory[item.category].push(item);
    } else {
      // If category doesn't exist (might be a deleted custom category), put in Other
      itemsByCategory['Other'] = itemsByCategory['Other'] || [];
      itemsByCategory['Other'].push(item);
    }
  });
  
  const handleDuplicateList = async () => {
    if (currentList) {
      await duplicateList(currentList.id);
      navigate('/');
    }
  };

  const handleEditItem = (item: GroceryItem) => {
    setItemToEdit(item);
    setShowEditItemForm(true);
  };

  const handleDeleteItem = async (itemId: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      await deleteItem(itemId);
    }
  };

  const handleCloseEditForm = () => {
    setShowEditItemForm(false);
    setItemToEdit(null);
  };

  const handleEditListName = () => {
    setShowEditListNameForm(true);
  };
  
  return (
    <div>
      <div className="mb-6">
        <button
          onClick={() => navigate('/')}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-4"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to Lists
        </button>
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{currentList.name}</h1>
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <Calendar size={14} className="mr-1" />
                <span>Week of {format(parseISO(currentList.week_of), 'MMM d, yyyy')}</span>
              </div>
            </div>
            <button
              onClick={handleEditListName}
              className="ml-2 p-1 text-gray-500 hover:text-emerald-600 rounded-full hover:bg-gray-100"
              title="Edit list name"
            >
              <Edit size={16} />
            </button>
          </div>
          
          <div className="flex mt-4 md:mt-0 space-x-2">
            {!currentList.is_completed && (
              <>
                <button
                  onClick={() => setShowAddItemForm(true)}
                  className="flex items-center px-3 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                >
                  <Plus size={16} className="mr-1" />
                  Add Item
                </button>
                
                <button
                  onClick={() => setShowCompleteForm(true)}
                  className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <CheckCircle size={16} className="mr-1" />
                  Complete
                </button>
              </>
            )}
            
            <button
              onClick={handleDuplicateList}
              className="flex items-center px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              <Copy size={16} className="mr-1" />
              Duplicate
            </button>
          </div>
        </div>
      </div>
      
      {currentList.is_completed && currentList.total_spent && (
        <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 mb-6">
          <div className="flex items-start">
            <CheckCircle className="h-5 w-5 text-emerald-600 mr-2 mt-0.5" />
            <div>
              <p className="text-emerald-700 font-medium">Shopping completed</p>
              <p className="text-emerald-600">
                Total spent: €{currentList.total_spent.toFixed(2)} • 
                Payment: {currentList.payment_method}
              </p>
              {currentList.receipt_url && (
                <a 
                  href={currentList.receipt_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-emerald-600 underline text-sm mt-1 inline-block"
                >
                  View Receipt
                </a>
              )}
            </div>
          </div>
        </div>
      )}
      
      {listItems.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <ShoppingCart size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">No items in this list yet</h3>
          <p className="text-gray-500 mb-4">
            Start adding items to your grocery list.
          </p>
          <button
            onClick={() => setShowAddItemForm(true)}
            className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
          >
            <Plus size={18} className="mr-1" />
            Add First Item
          </button>
        </div>
      ) : (
        <div>
          {Object.keys(itemsByCategory).map(category => (
            itemsByCategory[category].length > 0 && (
              <CategoryGroup
                key={category}
                category={category}
                items={itemsByCategory[category]}
                onToggleCheck={toggleItemCheck}
                onMoveToCategory={moveItemToCategory}
                onEditItem={handleEditItem}
                onDeleteItem={handleDeleteItem}
              />
            )
          ))}
        </div>
      )}
      
      {showAddItemForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 modal-overlay">
          <div className="max-w-md w-full modal-content">
            <AddItemForm
              listId={currentList.id}
              onClose={() => setShowAddItemForm(false)}
            />
          </div>
        </div>
      )}

      {showEditItemForm && itemToEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 modal-overlay">
          <div className="max-w-md w-full modal-content">
            <EditItemForm
              item={itemToEdit}
              onClose={handleCloseEditForm}
            />
          </div>
        </div>
      )}
      
      {showCompleteForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 modal-overlay">
          <div className="max-w-md w-full modal-content">
            <CompleteShoppingForm
              listId={currentList.id}
              onClose={() => setShowCompleteForm(false)}
            />
          </div>
        </div>
      )}

      {showEditListNameForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 modal-overlay">
          <div className="max-w-md w-full modal-content">
            <EditListNameForm
              list={currentList}
              onClose={() => setShowEditListNameForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ListDetailPage;