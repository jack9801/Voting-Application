import { useEffect, useState } from 'react';
import axios from 'axios';

function CandidateList() {
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_BASE}/candidate`)
      .then(res => setCandidates(res.data.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Candidate List</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {candidates.map(c => (
          <div key={c._id} className="bg-white p-4 rounded shadow">
            <h3 className="text-xl font-semibold">{c.name}</h3>
            <p>Party: {c.party}</p>
            <p>Age: {c.age}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CandidateList;
