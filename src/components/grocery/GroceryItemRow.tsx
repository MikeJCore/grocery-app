import React, { useState, useRef, useEffect } from 'react';
import { Check, MoreVertical, Move, Edit, Trash } from 'lucide-react';
import { useCategoryStore } from '../../store/categoryStore';
import { GroceryItem } from '../../types';

interface GroceryItemRowProps {
  item: GroceryItem;
  onToggleCheck: (itemId: string) => void;
  onMoveToCategory: (itemId: string, category: string) => void;
  onEdit: (item: GroceryItem) => void;
  onDelete: (itemId: string) => void;
}

const GroceryItemRow: React.FC<GroceryItemRowProps> = ({
  item,
  onToggleCheck,
  onMoveToCategory,
  onEdit,
  onDelete
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  const { categories, fetchCategories } = useCategoryStore();
  
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);
  
  const handleToggleCheck = () => {
    onToggleCheck(item.id);
  };
  
  const handleMoveToCategory = (category: string) => {
    onMoveToCategory(item.id, category);
    setShowMenu(false);
  };

  const handleEdit = () => {
    onEdit(item);
    setShowMenu(false);
  };

  const handleDelete = () => {
    onDelete(item.id);
    setShowMenu(false);
  };

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current && 
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current && 
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  return (
    <div className={`border-b border-gray-100 last:border-b-0 ${item.is_checked ? 'bg-gray-50' : ''}`}>
      <div className="flex items-center p-3">
        <button
          onClick={handleToggleCheck}
          className={`flex-shrink-0 h-5 w-5 rounded-full border ${
            item.is_checked 
              ? 'bg-emerald-500 border-emerald-500 flex items-center justify-center' 
              : 'border-gray-300'
          }`}
        >
          {item.is_checked && <Check size={12} className="text-white" />}
        </button>
        
        <div className="ml-3 flex-grow">
          <p 
            onClick={toggleMenu}
            className={`text-sm font-medium ${item.is_checked ? 'text-gray-500 line-through' : 'text-gray-800'} cursor-pointer hover:text-emerald-600`}
          >
            {item.name}
          </p>
          <p className="text-xs text-gray-500">
            {item.quantity} {item.unit && item.unit}
          </p>
        </div>
        
        <div className="relative">
          <button
            ref={buttonRef}
            onClick={toggleMenu}
            className="p-1 rounded-full hover:bg-gray-100"
            type="button"
            aria-haspopup="true"
            aria-expanded={showMenu}
          >
            <MoreVertical size={16} className="text-gray-500" />
          </button>
          
          {showMenu && (
            <div 
              ref={menuRef}
              className="absolute right-0 top-full mt-1 w-48 bg-white rounded-md shadow-lg dropdown-menu py-1 border border-gray-200"
              style={{ minWidth: '180px', zIndex: 9999 }}
            >
              <button
                onClick={handleEdit}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                type="button"
              >
                <Edit size={14} className="mr-2 text-gray-500" />
                Edit Item
              </button>
              
              <button
                onClick={handleDelete}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                type="button"
              >
                <Trash size={14} className="mr-2 text-red-500" />
                Delete Item
              </button>
              
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 flex items-center border-t border-gray-100 mt-1 pt-1">
                <Move size={12} className="mr-1" />
                Move to category
              </div>
              
              {categories
                .filter(cat => cat.name !== item.category)
                .map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleMoveToCategory(category.name)}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    type="button"
                  >
                    {category.name}
                  </button>
                ))
              }
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GroceryItemRow;