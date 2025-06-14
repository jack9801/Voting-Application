import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaCheckCircle, FaTimesCircle, FaUser } from 'react-icons/fa';

export default function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const res = await axios.get('http://localhost:3000/user/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(res.data.user);
      } catch (err) {
        console.error('Failed to fetch profile', err);
      }
    };

    fetchProfile();
  }, []);

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-purple-100">
        <p className="text-xl text-gray-600 animate-pulse">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex items-center justify-center">
      <div className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-md transform hover:scale-105 transition duration-300 ease-in-out">
        <div className="flex items-center justify-center mb-6">
          <FaUser className="text-5xl text-blue-600" />
        </div>
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">User Profile</h2>
        <div className="space-y-4 text-gray-700">
          <Info label="Name" value={user.name} />
          <Info label="Email" value={user.email} />
          <Info label="Aadhar Number" value={user.aadharcardNumber} />
          <Info label="Mobile" value={user.mobile} />
          <Info label="Age" value={user.age} />
          <Info label="Role" value={capitalize(user.role)} />
          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">Voted:</span>
            {user.isvoted ? (
              <span className="flex items-center text-green-600 font-semibold">
                <FaCheckCircle className="mr-1" /> Yes
              </span>
            ) : (
              <span className="flex items-center text-red-600 font-semibold">
                <FaTimesCircle className="mr-1" /> No
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-600 font-medium">{label}:</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
