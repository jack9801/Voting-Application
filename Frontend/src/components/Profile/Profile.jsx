import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaUserCircle, FaCheckCircle, FaTimesCircle, FaKey } from 'react-icons/fa';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '' });
  const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const res = await axios.get(`${import.meta.env.VITE_API_BASE}/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data.user);
      } catch (err) {
        console.error('Failed to fetch profile', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordMessage({ type: '', text: '' });
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${import.meta.env.VITE_API_BASE}/user/profile/password`, passwordData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPasswordMessage({ type: 'success', text: 'Password updated successfully!' });
      setShowPasswordForm(false);
      setPasswordData({ currentPassword: '', newPassword: '' });
    } catch (err) {
      setPasswordMessage({ type: 'error', text: err.response?.data?.error || 'Failed to update password.' });
    } finally {
      setPasswordLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <p className="text-xl text-gray-600 animate-pulse">Loading Profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-lg">
        <div className="flex flex-col items-center mb-6">
          <FaUserCircle className="text-8xl text-indigo-500" />
          <h2 className="text-4xl font-bold text-gray-800 mt-4">{user.name}</h2>
          <p className="text-gray-500">{capitalize(user.role)}</p>
        </div>

        {passwordMessage.text && (
          <p className={`mb-4 text-center p-3 rounded-lg ${
              passwordMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}
          >
            {passwordMessage.text}
          </p>
        )}

        <div className="space-y-4 text-lg text-gray-700 border-t border-b py-6">
          <Info label="Email" value={user.email} />
          <Info label="Aadhar Number" value={user.aadharcardNumber} />
          <Info label="Mobile" value={user.mobile} />
          <Info label="Age" value={user.age} />
          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">Voting Status:</span>
            {user.isvoted ? (
              <span className="flex items-center text-green-600 font-semibold px-3 py-1 bg-green-100 rounded-full">
                <FaCheckCircle className="mr-2" /> Voted
              </span>
            ) : (
              <span className="flex items-center text-red-600 font-semibold px-3 py-1 bg-red-100 rounded-full">
                <FaTimesCircle className="mr-2" /> Not Voted
              </span>
            )}
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={() => setShowPasswordForm(!showPasswordForm)}
            className="w-full flex justify-center items-center py-3 px-4 text-md font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition duration-300"
          >
            <FaKey className="mr-2" /> Change Password
          </button>

          {showPasswordForm && (
            <form onSubmit={handlePasswordChange} className="mt-6 space-y-4 animate-fade-in">
              <input
                type="password"
                placeholder="Current Password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
              <input
                type="password"
                placeholder="New Password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
              <button
                type="submit"
                disabled={passwordLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
              >
                {passwordLoading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-gray-600 font-medium">{label}:</span>
      <span className="font-semibold text-gray-800">{value}</span>
    </div>
  );
}

function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}