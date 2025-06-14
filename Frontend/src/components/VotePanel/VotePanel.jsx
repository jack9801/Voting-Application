import { useEffect, useState } from 'react';
import axios from 'axios';

function VotePanel() {
  const [candidates, setCandidates] = useState([]);
  const token = localStorage.getItem('token'); // assuming token storage

  const vote = (id) => {
    axios.get(`http://localhost:3000/candidate/vote/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => alert(res.data.message))
      .catch(err => alert(err.response?.data?.message || "Vote failed"));
  };

  useEffect(() => {
    axios.get('http://localhost:3000/candidate')
      .then(res => setCandidates(res.data.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Vote for a Candidate</h2>
      <div className="grid gap-4">
        {candidates.map(c => (
          <div key={c._id} className="bg-white p-4 rounded shadow flex justify-between items-center">
            <div>
              <h3 className="text-xl">{c.name}</h3>
              <p>{c.party}</p>
            </div>
            <button
              onClick={() => vote(c._id)}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Vote
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default VotePanel;
