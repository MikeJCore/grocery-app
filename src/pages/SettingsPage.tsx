import React, { useEffect } from 'react';
import { Settings, User, Tag } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useCategoryStore } from '../store/categoryStore';
import InvitePartner from '../components/settings/InvitePartner';
import CategoryManager from '../components/settings/CategoryManager';
import DatabaseStatus from '../components/settings/DatabaseStatus';

const SettingsPage: React.FC = () => {
  const { user } = useAuthStore();
  const { fetchCategories } = useCategoryStore();
  
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);
  
  if (!user) {
    return null;
  }
  
  return (
    <div>
      <div className="flex items-center mb-6">
        <Settings className="h-6 w-6 text-emerald-600 mr-2" />
        <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <User className="h-6 w-6 text-emerald-600 mr-2" />
            <h2 className="text-xl font-semibold">Account Information</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="px-3 py-2 bg-gray-100 rounded-md text-gray-800">
                {user.email}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Account Created
              </label>
              <div className="px-3 py-2 bg-gray-100 rounded-md text-gray-800">
                {new Date(user.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
        
        <DatabaseStatus />
        
        <InvitePartner />
        
        <CategoryManager />
      </div>
    </div>
  );
};

export default SettingsPage;