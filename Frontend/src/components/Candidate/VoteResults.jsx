//src/components/Candidate/ VoteResults.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function VoteResults() {
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");

 useEffect(() => {
  axios.get(`${import.meta.env.VITE_API_BASE}/candidate/party`)
    .then(res => {
      if (Array.isArray(res.data)) {
        setResults(res.data);
      } else {
        console.error('Unexpected response:', res.data);
      }
    })
    .catch(err => console.error('Error fetching vote data:', err));
}, []);


  if (error) {
    return <div className="text-red-500 text-center mt-4">{error}</div>;
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow bg-white">
      <h2 className="text-2xl font-bold mb-4 text-center">Vote Results</h2>
      {results.length === 0 ? (
        <p className="text-gray-600 text-center">No votes recorded yet.</p>
      ) : (
        <ul className="space-y-3">
          {results.map((r, i) => (
            <li key={i} className="bg-gray-100 p-3 rounded shadow">
              <span className="font-semibold">{r.party}</span>: {r.count} votes
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
