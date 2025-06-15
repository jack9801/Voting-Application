import { useState } from 'react';
import axios from 'axios';

export default function AdminCampaign() {
  const [partyData, setPartyData] = useState({
    name: '',
    colorTheme: '',
    startTime: '',
    endTime: '',
    logo: null
  });
  const [candidateData, setCandidateData] = useState({ name: '', age: '', party: '' });

  const handlePartyChange = (e) => {
    const { name, value, files } = e.target;
    setPartyData((prev) => ({ ...prev, [name]: files ? files[0] : value }));
  };

  const handleCandidateChange = (e) => {
    const { name, value } = e.target;
    setCandidateData((prev) => ({ ...prev, [name]: value }));
  };

  const createParty = async () => {
    const formData = new FormData();
    Object.keys(partyData).forEach(key => formData.append(key, partyData[key]));
    await axios.post(`${import.meta.env.VITE_API_BASE}/candidate/logo`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  };

  const createCandidate = async () => {
    await axios.post(`${import.meta.env.VITE_API_BASE}/candidate`, candidateData);
  };

  return (
    <div className="p-4 space-y-6">
      <div className="border p-4 rounded shadow">
        <h3 className="text-xl font-bold mb-2">Create Party</h3>
        <input name="name" placeholder="Party Name" onChange={handlePartyChange} />
        <input name="colorTheme" placeholder="Color Theme" onChange={handlePartyChange} />
        <input name="startTime" type="datetime-local" onChange={handlePartyChange} />
        <input name="endTime" type="datetime-local" onChange={handlePartyChange} />
        <input name="logo" type="file" accept="image/*" onChange={handlePartyChange} />
        <button onClick={createParty} className="bg-blue-500 text-white px-4 py-2 mt-2">Create Party</button>
      </div>

      <div className="border p-4 rounded shadow">
        <h3 className="text-xl font-bold mb-2">Create Candidate</h3>
        <input name="name" placeholder="Candidate Name" onChange={handleCandidateChange} />
        <input name="age" placeholder="Age" onChange={handleCandidateChange} />
        <input name="party" placeholder="Party Name" onChange={handleCandidateChange} />
        <button onClick={createCandidate} className="bg-green-500 text-white px-4 py-2 mt-2">Create Candidate</button>
      </div>
    </div>
  );
}
