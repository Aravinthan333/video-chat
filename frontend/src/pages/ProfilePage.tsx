import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/user.service';

const ProfilePage: React.FC = () => {
  const { user, logout, refreshUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      await userService.updateProfile({ displayName, bio });
      await refreshUser(); // Re-fetch user from server to get latest state
      setSuccess('Profile updated!');
      setEditing(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-lg p-8">
        {/* Avatar */}
        <div className="flex flex-col items-center mb-8">
          <img
            src={user.avatar || '/default-avatar.png'}
            alt={user.name}
            className="w-24 h-24 rounded-full object-cover ring-4 ring-blue-50"
          />
          <h2 className="mt-4 text-2xl font-bold text-gray-900">
            {user.displayName || user.name}
          </h2>
          <p className="text-gray-400 text-sm">{user.email}</p>
        </div>

        {/* Profile Fields */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Display Name
            </label>
            {editing ? (
              <input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                maxLength={50}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-800">{user.displayName || '—'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            {editing ? (
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                maxLength={500}
                rows={4}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            ) : (
              <p className="text-gray-800">{user.bio || '—'}</p>
            )}
          </div>
        </div>

        {/* Messages */}
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        {success && <p className="mt-3 text-sm text-green-600">{success}</p>}

        {/* Actions */}
        <div className="mt-6 flex gap-3">
          {editing ? (
            <>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 bg-blue-600 text-white rounded-lg py-2 font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                onClick={() => setEditing(false)}
                className="flex-1 border border-gray-200 rounded-lg py-2 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="flex-1 bg-blue-600 text-white rounded-lg py-2 font-medium hover:bg-blue-700 transition-colors"
            >
              Edit Profile
            </button>
          )}

          <button
            onClick={logout}
            className="flex-1 border border-red-200 text-red-600 rounded-lg py-2 font-medium hover:bg-red-50 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;