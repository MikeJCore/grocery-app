import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Check, Calendar, Edit } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { GroceryList } from '../../types';

interface GroceryListCardProps {
  list: GroceryList;
  onEditName?: (list: GroceryList) => void;
}

const GroceryListCard: React.FC<GroceryListCardProps> = ({ list, onEditName }) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(`/list/${list.id}`);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEditName) {
      onEditName(list);
    }
  };
  
  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
      onClick={handleClick}
    >
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center flex-grow mr-2">
            <h3 className="text-lg font-semibold text-gray-800 truncate">{list.name}</h3>
            {onEditName && (
              <button
                onClick={handleEditClick}
                className="ml-2 p-1 text-gray-400 hover:text-emerald-600 rounded-full hover:bg-gray-100"
                title="Edit list name"
              >
                <Edit size={14} />
              </button>
            )}
          </div>
          {list.is_completed ? (
            <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded-full flex items-center flex-shrink-0">
              <Check size={12} className="mr-1" />
              Completed
            </span>
          ) : (
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center flex-shrink-0">
              <ShoppingCart size={12} className="mr-1" />
              Active
            </span>
          )}
        </div>
        
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <Calendar size={14} className="mr-1" />
          <span>Week of {format(parseISO(list.week_of), 'MMM d, yyyy')}</span>
        </div>
        
        {list.is_completed && list.total_spent && (
          <div className="mt-2 text-sm">
            <span className="font-medium text-gray-700">Total: </span>
            <span className="text-emerald-600 font-semibold">€{list.total_spent.toFixed(2)}</span>
          </div>
        )}
      </div>
      
      <div className="bg-gray-50 px-4 py-3 border-t border-gray-100">
        <div className="text-xs text-gray-500">
          Created {format(parseISO(list.created_at), 'MMM d, yyyy')}
        </div>
      </div>
    </div>
  );
};

export default GroceryListCard;