import React from 'react';
import { GroceryItem } from '../../types';
import GroceryItemRow from './GroceryItemRow';

interface CategoryGroupProps {
  category: string;
  items: GroceryItem[];
  onToggleCheck: (itemId: string) => void;
  onMoveToCategory: (itemId: string, category: string) => void;
  onEditItem: (item: GroceryItem) => void;
  onDeleteItem: (itemId: string) => void;
}

const CategoryGroup: React.FC<CategoryGroupProps> = ({
  category,
  items,
  onToggleCheck,
  onMoveToCategory,
  onEditItem,
  onDeleteItem
}) => {
  if (items.length === 0) {
    return null;
  }
  
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{category}</h3>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {items.map((item) => (
          <GroceryItemRow
            key={item.id}
            item={item}
            onToggleCheck={onToggleCheck}
            onMoveToCategory={onMoveToCategory}
            onEdit={onEditItem}
            onDelete={onDeleteItem}
          />
        ))}
      </div>
    </div>
  );
};

export default CategoryGroup;