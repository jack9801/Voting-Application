import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaUserTie, FaVoteYea } from 'react-icons/fa';

const CandidateList = () => {
  const [candidates, setCandidates] = useState([]);
  const [parties, setParties] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const partyLogoMap = parties.reduce((acc, party) => {
    acc[party.name] = party.logo;
    return acc;
  }, {});

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const userRes = await axios.get(`${import.meta.env.VITE_API_BASE}/candidate/currentUser`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(userRes.data.user);

        const candidateRes = await axios.get(`${import.meta.env.VITE_API_BASE}/candidate`);
        setCandidates(candidateRes.data.data);

        const partyRes = await axios.get(`${import.meta.env.VITE_API_BASE}/candidate/partylist`);
        setParties(partyRes.data.parties || []);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch necessary data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const voteHandler = async (candidateId) => {
    if (!user || user.role === "admin") {
      alert("Admin is not allowed to vote");
      return;
    }

    if (user.isvoted) {
      alert("You have already voted.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${import.meta.env.VITE_API_BASE}/candidate/vote/${candidateId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage("Thank you! Your vote has been recorded.");
      setUser({ ...user, isvoted: true });

      // Refresh candidate list to show updated vote counts for admins
      const refresh = await axios.get(`${import.meta.env.VITE_API_BASE}/candidate`);
      setCandidates(refresh.data.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Something went wrong while voting.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <p className="text-xl text-gray-600 animate-pulse">Loading Candidates...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-4xl font-bold text-gray-800">Meet the Candidates</h2>
          {user?.role === "Admin" && (
            <button
              onClick={() => navigate('/admin/campaign')}
              className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition duration-300"
            >
              Manage Campaign
            </button>
          )}
        </div>

        {error && <p className="text-red-500 bg-red-100 p-4 rounded-lg text-center mb-6">{error}</p>}
        {message && <p className="text-green-600 bg-green-100 p-4 rounded-lg text-center mb-6">{message}</p>}

        {candidates.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-500">No candidates have been declared yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {candidates.map((c) => (
              <div key={c._id} className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition duration-300">
                <div className="p-6">
                  <div className="flex items-center space-x-4">
                    {partyLogoMap[c.party] ? (
                      <img src={partyLogoMap[c.party]} alt={`${c.party} logo`} className="w-20 h-20 rounded-full border-4 border-gray-200 object-cover" />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                        <FaUserTie className="text-gray-500 text-4xl" />
                      </div>
                    )}
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800">{c.name}</h3>
                      <p className="text-md text-gray-600">{c.party}</p>
                      <p className="text-sm text-gray-500">Age: {c.age}</p>
                    </div>
                  </div>

                  <div className="mt-6">
                    {user?.role === "Admin" ? (
                      <p className="text-lg text-center text-green-700 font-semibold bg-green-100 py-2 rounded-lg">
                        Votes: {c.voteCount}
                      </p>
                    ) : user?.role === "voter" && !user?.isvoted ? (
                      <button
                        onClick={() => voteHandler(c._id)}
                        className="w-full flex items-center justify-center py-3 px-4 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition duration-300"
                      >
                        <FaVoteYea className="mr-2" /> Vote
                      </button>
                    ) : user?.role === "voter" && user?.isvoted ? (
                       <p className="text-center text-gray-600 font-semibold bg-gray-200 py-3 rounded-lg">You have voted</p>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateList;