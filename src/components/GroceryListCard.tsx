import { format, parseISO } from 'date-fns';
import { ShoppingCart, Check, Calendar } from 'lucide-react';
import { GroceryList } from '../types';

interface GroceryListCardProps {
  list: GroceryList;
  onPress: () => void;
}

export default function GroceryListCard({ list, onPress }: GroceryListCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4 cursor-pointer hover:shadow-md transition-shadow" onClick={onPress}>
      <div className="flex flex-col">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-medium text-gray-900 truncate">
            {list.name}
          </h3>
          {list.is_completed ? (
            <div className="flex items-center bg-green-50 text-green-800 text-xs px-2 py-1 rounded-md">
              <Check className="h-3 w-3 mr-1" />
              <span>Completed</span>
            </div>
          ) : (
            <div className="flex items-center bg-blue-50 text-blue-800 text-xs px-2 py-1 rounded-md">
              <ShoppingCart className="h-3 w-3 mr-1" />
              <span>Active</span>
            </div>
          )}
        </div>

        <div className="flex items-center text-gray-500 text-sm mb-2">
          <Calendar className="h-4 w-4 mr-1" />
          <span>Week of {format(parseISO(list.week_of), 'MMM d, yyyy')}</span>
        </div>

        {list.is_completed && list.total_spent && (
          <div className="flex items-center mt-1">
            <span className="text-sm text-gray-600">Total: </span>
            <span className="ml-1 font-medium">
              €{list.total_spent.toFixed(2)}
            </span>
          </div>
        )}
      </div>

      <div className="mt-2 pt-2 border-t border-gray-100">
        <p className="text-sm text-gray-500">
          Created {format(parseISO(list.created_at), 'MMM d, yyyy')}
        </p>
      </div>
    </div>
  );
}