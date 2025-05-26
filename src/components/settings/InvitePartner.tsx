import React, { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const InvitePartner: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isInviteSent, setIsInviteSent] = useState(false);
  const { invitePartner, isLoading } = useAuthStore();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await invitePartner(email);
      setIsInviteSent(true);
      setEmail('');
    } catch (error) {
      console.error('Failed to send invitation:', error);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center mb-4">
        <UserPlus className="h-6 w-6 text-emerald-600 mr-2" />
        <h2 className="text-xl font-semibold">Invite Partner</h2>
      </div>
      
      {isInviteSent ? (
        <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 mb-4">
          <p className="text-emerald-700">
            Invitation sent successfully! Your partner will receive an email with instructions.
          </p>
          <button
            onClick={() => setIsInviteSent(false)}
            className="mt-2 text-sm text-emerald-600 hover:text-emerald-500"
          >
            Send another invitation
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="partner-email" className="block text-sm font-medium text-gray-700 mb-1">
              Partner's Email Address
            </label>
            <input
              type="email"
              id="partner-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="partner@example.com"
              required
            />
          </div>
          
          <p className="text-sm text-gray-500 mb-4">
            Your partner will receive an email with a link to join your household.
          </p>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
          >
            {isLoading ? 'Sending Invitation...' : 'Send Invitation'}
          </button>
        </form>
      )}
    </div>
  );
};

export default InvitePartner;