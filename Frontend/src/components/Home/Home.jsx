import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated, role, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div
      className="flex flex-col justify-center items-center h-screen bg-cover bg-center p-4"
      style={{
        backgroundImage:
          "url('https://images.pexels.com/photos/4549414/pexels-photo-4549414.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')",
      }}
    >
      <div className="bg-white bg-opacity-80 p-10 rounded-lg shadow-2xl text-center max-w-md w-full backdrop-blur-md">
        <h1 className="text-5xl font-extrabold mb-6 text-gray-800 tracking-tight">
          Secure Voting Platform
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Your Voice, Your Vote. Participate in a fair and transparent electoral process.
        </p>

        {!isAuthenticated ? (
          <div className="space-y-4">
            <button
              onClick={() => navigate('/login')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition duration-300 ease-in-out transform hover:scale-105"
            >
              Login to Vote
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="w-full bg-gray-700 hover:bg-gray-800 text-white font-bold py-3 px-6 rounded-lg text-lg transition duration-300 ease-in-out transform hover:scale-105"
            >
              Register to Vote
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <button
              onClick={() => navigate('/profile')}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition duration-300 ease-in-out transform hover:scale-105"
            >
              View Profile
            </button>
            <button
              onClick={() => navigate('/candidates')}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition duration-300 ease-in-out transform hover:scale-105"
            >
              View Candidates
            </button>
            {role === 'Admin' && (
              <>
              <button
                    onClick={() => navigate("/admin/campaign")}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded w-full"
                >
                    Create/Update Party
                </button>
                <button
                  onClick={() => navigate('/results')}
                  className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition duration-300 ease-in-out transform hover:scale-105"
                >
                  View Results
                </button>
                <button
                    onClick={() => navigate('/admin/voters')}
                    className="w-full bg-gray-800 hover:bg-gray-900 text-white font-bold py-3 px-6 rounded-lg text-lg transition duration-300 ease-in-out transform hover:scale-105"
                >
                    View Voters
                </button>
              </>
            )}
            <button
              onClick={handleLogout}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition duration-300 ease-in-out transform hover:scale-105"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;