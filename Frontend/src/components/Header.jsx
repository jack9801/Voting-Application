import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Header() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // clear auth state
    navigate('/'); // go back to Home
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-gray-900 text-white px-6 py-4 flex justify-between items-center shadow-md z-50">
      <h1 className="text-xl font-semibold">Voting App</h1>
      <button
        onClick={handleLogout}
        className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded"
      >
        Logout
      </button>
    </header>
  );
}

export default Header;
