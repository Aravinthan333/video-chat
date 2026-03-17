import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { authService } from '../services/auth.service';
import { removeUser, setUser } from '../reduxStore/slices/userSlice';

const DashboardPage: React.FC = () => {
  const dispatch = useDispatch()
  const user = useSelector((state:any) => state.user);
  const navigate = useNavigate()
  
  const logout = async () => {
    dispatch(removeUser())
      await authService.logout();
      navigate("/login")
    };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <button
              onClick={logout}
              className="text-sm text-red-500 hover:text-red-700 transition-colors"
            >
              Logout
            </button>
          </div>

          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
            <img
              src={user?.avatar || '/default-avatar.png'}
              alt={user?.name}
              className="w-14 h-14 rounded-full object-cover"
            />
            <div>
              <p className="font-semibold text-gray-900">
                {user?.displayName || user?.name}
              </p>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
          </div>
          <div className="mt-6">
            <Link
              to="/profile"
              className="inline-block bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Edit Profile →
            </Link>
          </div>
          <div className="mt-6">
            <Link
              to="/room"
              className="inline-block bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Create Room 
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;