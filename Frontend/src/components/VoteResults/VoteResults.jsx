import { useEffect, useState } from 'react';
import axios from 'axios';

function VoteResults() {
  const [results, setResults] = useState([]);

  useEffect(() => {
    axios.get('${import.meta.env.VITE_API_BASE}/candidate/party')
      .then(res => setResults(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Vote Results</h2>
      <ul className="space-y-4">
        {results.map((r, i) => (
          <li key={i} className="bg-gray-100 p-4 rounded">
            <div className="flex justify-between">
              <span className="font-semibold">{r.party}</span>
              <span>{r.count} votes</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default VoteResults;
