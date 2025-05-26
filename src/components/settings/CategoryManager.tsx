import React, { useState, useEffect } from 'react';
import { Tag, Plus, Edit, Trash, Save, X } from 'lucide-react';
import { useCategoryStore } from '../../store/categoryStore';
import { Category } from '../../types';

const CategoryManager: React.FC = () => {
  const { categories, fetchCategories, addCategory, updateCategory, deleteCategory, isLoading } = useCategoryStore();
  const [newCategory, setNewCategory] = useState('');
  const [editingCategory, setEditingCategory] = useState<{id: string, name: string} | null>(null);
  
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);
  
  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategory.trim()) {
      addCategory(newCategory.trim());
      setNewCategory('');
    }
  };
  
  const handleUpdateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategory && editingCategory.name.trim()) {
      updateCategory(editingCategory.id, editingCategory.name.trim());
      setEditingCategory(null);
    }
  };
  
  const handleDeleteCategory = (id: string) => {
    if (window.confirm('Are you sure you want to delete this category? Items in this category will be moved to "Other".')) {
      deleteCategory(id);
    }
  };
  
  const startEditing = (category: Category) => {
    setEditingCategory({ id: category.id, name: category.name });
  };
  
  const cancelEditing = () => {
    setEditingCategory(null);
  };
  
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center mb-4">
        <Tag className="h-6 w-6 text-emerald-600 mr-2" />
        <h2 className="text-xl font-semibold">Manage Categories</h2>
      </div>
      
      <form onSubmit={handleAddCategory} className="mb-6">
        <div className="flex">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="New category name"
            required
          />
          <button
            type="submit"
            disabled={isLoading || !newCategory.trim()}
            className="px-4 py-2 border border-transparent rounded-r-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 flex items-center"
          >
            <Plus size={16} className="mr-1" />
            Add
          </button>
        </div>
      </form>
      
      <div className="space-y-2">
        {categories.length === 0 ? (
          <p className="text-gray-500 text-center py-4">Loading categories...</p>
        ) : (
          categories.map((category) => (
            <div key={category.id} className="border border-gray-200 rounded-md p-3">
              {editingCategory && editingCategory.id === category.id ? (
                <form onSubmit={handleUpdateCategory} className="flex items-center">
                  <input
                    type="text"
                    value={editingCategory.name}
                    onChange={(e) => setEditingCategory({...editingCategory, name: e.target.value})}
                    className="flex-grow px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 mr-2"
                    placeholder="Category name"
                    required
                    autoFocus
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !editingCategory.name.trim()}
                    className="p-2 text-emerald-600 hover:text-emerald-700 focus:outline-none"
                    title="Save"
                  >
                    <Save size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={cancelEditing}
                    className="p-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                    title="Cancel"
                  >
                    <X size={18} />
                  </button>
                </form>
              ) : (
                <div className="flex items-center justify-between">
                  <span className="text-gray-800">{category.name}</span>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => startEditing(category)}
                      className={`p-1 text-gray-500 hover:text-emerald-600 focus:outline-none ${category.is_default ? 'opacity-50 cursor-not-allowed' : ''}`}
                      title={category.is_default ? "Default categories cannot be edited" : "Edit"}
                      disabled={category.is_default}
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      className={`p-1 text-gray-500 hover:text-red-600 focus:outline-none ${category.is_default ? 'opacity-50 cursor-not-allowed' : ''}`}
                      title={category.is_default ? "Default categories cannot be deleted" : "Delete"}
                      disabled={category.is_default}
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
      
      <div className="mt-4 text-sm text-gray-500">
        <p>Note: Default categories cannot be edited or deleted.</p>
      </div>
    </div>
  );
};

export default CategoryManager;