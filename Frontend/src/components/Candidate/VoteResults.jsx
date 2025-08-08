import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaPoll } from 'react-icons/fa';

export default function VoteResults() {
  const [results, setResults] = useState([]);
  const [totalVotes, setTotalVotes] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_BASE}/candidate/party`)
      .then(res => {
        if (Array.isArray(res.data)) {
          const sortedResults = res.data.sort((a, b) => b.count - a.count);
          setResults(sortedResults);
          const total = sortedResults.reduce((sum, item) => sum + item.count, 0);
          setTotalVotes(total);
        } else {
          setError('Received invalid data from the server.');
        }
      })
      .catch(err => {
        console.error('Error fetching vote data:', err);
        setError('Could not fetch vote results.');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <p className="text-xl text-gray-600 animate-pulse">Loading Results...</p>
      </div>
    );
  }
  
  if (error) {
    return <div className="text-red-500 text-center mt-8 text-lg">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-2xl p-8">
        <div className="flex items-center justify-center mb-6">
          <FaPoll className="text-4xl text-indigo-600 mr-3" />
          <h2 className="text-4xl font-extrabold text-gray-800">Live Vote Results</h2>
        </div>
        
        {results.length === 0 ? (
          <p className="text-gray-600 text-center py-10 text-lg">No votes have been recorded yet.</p>
        ) : (
          <div className="space-y-6">
            <p className="text-center text-gray-500 font-medium">Total Votes Cast: {totalVotes}</p>
            {results.map((r, i) => {
              const percentage = totalVotes > 0 ? ((r.count / totalVotes) * 100).toFixed(1) : 0;
              return (
                <div key={i}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-lg text-gray-700">{r.party}</span>
                    <span className="text-gray-600 font-semibold">{r.count} votes ({percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                    <div
                      className="bg-indigo-600 h-4 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}