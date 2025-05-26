import React, { useState, useEffect } from 'react';
import { Database, Server, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const DatabaseStatus: React.FC = () => {
  const [status, setStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const checkConnection = async () => {
      try {
        // Try to fetch a simple query to check connection
        const { data, error } = await supabase
          .from('categories')
          .select('count')
          .limit(1);
        
        if (error) {
          console.error('Database connection error:', error);
          setStatus('error');
          setError(error.message);
        } else {
          console.log('Database connection successful');
          setStatus('connected');
        }
      } catch (err) {
        console.error('Database connection exception:', err);
        setStatus('error');
        setError(err instanceof Error ? err.message : String(err));
      }
    };
    
    checkConnection();
  }, []);
  
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center mb-4">
        <Database className="h-6 w-6 text-emerald-600 mr-2" />
        <h2 className="text-xl font-semibold">Database Status</h2>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center">
          <Server className="h-5 w-5 text-gray-500 mr-2" />
          <span className="text-gray-700 font-medium">Supabase Connection:</span>
          
          {status === 'checking' && (
            <div className="ml-2 flex items-center">
              <div className="animate-spin h-4 w-4 border-2 border-emerald-500 rounded-full border-t-transparent"></div>
              <span className="ml-2 text-gray-500">Checking...</span>
            </div>
          )}
          
          {status === 'connected' && (
            <div className="ml-2 flex items-center">
              <CheckCircle className="h-5 w-5 text-emerald-500" />
              <span className="ml-2 text-emerald-600 font-medium">Connected</span>
            </div>
          )}
          
          {status === 'error' && (
            <div className="ml-2 flex items-center">
              <XCircle className="h-5 w-5 text-red-500" />
              <span className="ml-2 text-red-600 font-medium">Error</span>
            </div>
          )}
        </div>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}
        
        {status === 'connected' && (
          <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4">
            <p className="text-emerald-700">
              Your app is successfully connected to the Supabase database. All data will be stored and synchronized.
            </p>
          </div>
        )}
        
        <div className="text-sm text-gray-500">
          <p>Database URL: {supabase.supabaseUrl}</p>
        </div>
      </div>
    </div>
  );
};

export default DatabaseStatus;