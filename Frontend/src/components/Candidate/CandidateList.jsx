import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CandidateList = () => {
  const [candidates, setCandidates] = useState([]);
  const [parties, setParties] = useState([]);
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Map party names to logo URLs
  const partyLogoMap = parties.reduce((acc, party) => {
    acc[party.name] = party.logo;
    return acc;
  }, {});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const userRes = await axios.get(`${import.meta.env.VITE_API_BASE}/candidate/currentUser`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(userRes.data.user);
        localStorage.setItem("user", JSON.stringify(userRes.data.user));

        const candidateRes = await axios.get(`${import.meta.env.VITE_API_BASE}/candidate`);
        setCandidates(candidateRes.data.data);

        const partyRes = await axios.get(`${import.meta.env.VITE_API_BASE}/candidate/partylist`); // You need to expose this route
        setParties(partyRes.data.parties || []);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch user, candidates, or parties.");
      }
    };

    fetchData();
  }, []);

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

      alert(res.data.message);
      setUser({ ...user, isvoted: true });

      const refresh = await axios.get(`${import.meta.env.VITE_API_BASE}/candidate`);
      setCandidates(refresh.data.data);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  const handleCreateCandidate = () => {
    navigate("/admin");
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Candidate List</h2>
        {user?.role === "admin" && (
          <button
            onClick={handleCreateCandidate}
            className="px-4 py-2 bg-blue-600 text-white rounded shadow"
          >
            Create / Update Candidate
          </button>
        )}
      </div>

      {error && <p className="text-red-500">{error}</p>}
      {message && <p className="text-green-600">{message}</p>}

      {candidates.length === 0 ? (
        <p>No candidates available.</p>
      ) : (
        <ul className="space-y-4">
          {candidates.map((c) => (
            <li key={c._id} className="p-4 border rounded bg-gray-50 shadow-sm flex items-center space-x-4">
              {partyLogoMap[c.party] ? (
                <img src={partyLogoMap[c.party]} alt={`${c.party} logo`} className="w-16 h-16 rounded-full border" />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gray-200" />
              )}

              <div className="flex-grow">
                <p><strong>Name:</strong> {c.name}</p>
                <p><strong>Party:</strong> {c.party}</p>
                <p><strong>Age:</strong> {c.age}</p>

                {user?.role === "Admin" ? (
                  <p className="text-green-700 font-semibold">
                    <strong>Votes:</strong> {c.voteCount}
                  </p>
                ) : user?.role === "voter" && !user?.isvoted ? (
                  <button
                    onClick={() => voteHandler(c._id)}
                    className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Vote
                  </button>
                ) : user?.role === "voter" && user?.isvoted ? (
                  <p className="mt-2 text-gray-600">You have already voted.</p>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CandidateList;
