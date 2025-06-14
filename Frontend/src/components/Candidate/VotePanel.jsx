// VotePanel.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function VotePanel() {
  const [candidates, setCandidates] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get('/candidate')
      .then(res => setCandidates(res.data.data))
      .catch(err => console.error(err));
  }, []);

  const handleVote = async (id) => {
    try {
      const res = await axios.get(`/candidate/vote/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Voting failed');
    }
  };

  return (
    <div>
      <h2>Vote for a Candidate</h2>
      {candidates.map(c => (
        <div key={c._id}>
          {c.name} ({c.party}) - Age: {c.age}
          <button onClick={() => handleVote(c._id)}>Vote</button>
        </div>
      ))}
      <p>{message}</p>
    </div>
  );
}