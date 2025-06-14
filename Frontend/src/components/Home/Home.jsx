import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated, role, logout } = useAuth();

  const handleLogout = () => {
    logout(); // this removes token + role from localStorage too
    navigate('/'); // redirect to home page
  };

  return (
    <div
      className="flex justify-center items-center h-screen bg-cover bg-center"
      style={{
        backgroundImage:
         `url('https://images.pexels.com/photos/3532540/pexels-photo-3532540.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')`,
      }}
    >
      <div className="bg-white bg-opacity-70 p-10 rounded shadow text-center">
        <h1 className="text-3xl font-bold mb-6 text-black">
          Welcome to Voting App
        </h1>

        {!isAuthenticated ? (
          <div className="space-y-4">
            <button
              onClick={() => navigate("/login")}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded"
            >
              Signup
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <button
              onClick={() => navigate("/profile")}
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded w-full"
            >
              View Profile
            </button>

            <button
              onClick={() => navigate("/candidates")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded w-full"
            >
              View Candidate List
            </button>

            {role === "Admin" && (<>
              <button
                onClick={() => navigate("/admin/candidate-form")}
                className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2 px-4 rounded w-full"
              >
                Create/Update Candidate
              </button>
                              <button
                      onClick={() => navigate("/results")}
                      className="bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2 px-4 rounded w-full"
                    >
                      View Vote Count
                    </button>
                    </>
            )}

            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded w-full"
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
