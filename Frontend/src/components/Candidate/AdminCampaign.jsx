import { useState, useEffect } from 'react';
import axios from 'axios';

export default function AdminCampaign() {
  const [partyData, setPartyData] = useState({
    name: '',
    colorTheme: '',
    startTime: '',
    endTime: '',
    logo: null
  });

  const [candidateData, setCandidateData] = useState({
    name: '',
    age: '',
    party: ''
  });

  const [logoPreview, setLogoPreview] = useState(null);
  const [parties, setParties] = useState([]);

  const colorOptions = [
    { label: 'Red', value: '#dc2626' },
    { label: 'Blue', value: '#2563eb' },
    { label: 'Green', value: '#16a34a' },
    { label: 'Yellow', value: '#facc15' },
    { label: 'Purple', value: '#9333ea' }
  ];

  const handlePartyChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'logo' && files?.[0]) {
      setLogoPreview(URL.createObjectURL(files[0]));
    }

    setPartyData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleCandidateChange = (e) => {
    const { name, value } = e.target;
    setCandidateData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const createParty = async () => {
    const token = localStorage.getItem('token');
    if (!token) return alert('Unauthorized: Login as Admin');

    const formData = new FormData();
    Object.keys(partyData).forEach((key) =>
      formData.append(key, partyData[key])
    );

    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE}/candidate/logo`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        }
      );
      alert('Party created successfully!');
      fetchParties(); // Refresh party list
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to create party');
    }
  };

  const createCandidate = async () => {
    const token = localStorage.getItem('token');
    if (!token) return alert('Unauthorized: Login as Admin');

    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE}/candidate`,
        candidateData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      );
      alert('Candidate created successfully!');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to create candidate');
    }
  };

  const fetchParties = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE}/candidate/partylist`);
      setParties(res.data || []);
    } catch (err) {
      console.error('Failed to fetch parties:', err);
    }
  };

  useEffect(() => {
    fetchParties();
  }, []);

  return (
    <div className="p-6 space-y-8 max-w-3xl mx-auto">
      {/* Create Party Form */}
      <div className="border p-6 rounded shadow bg-white">
        <h3 className="text-2xl font-bold mb-4 text-blue-700">Create Party</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="name"
            placeholder="Party Name"
            onChange={handlePartyChange}
            className="p-2 border rounded"
          />

          <select
            name="colorTheme"
            onChange={handlePartyChange}
            className="p-2 border rounded"
            defaultValue=""
          >
            <option value="" disabled>
              Select Theme
            </option>
            {colorOptions.map((color) => (
              <option key={color.value} value={color.value}>
                {color.label}
              </option>
            ))}
          </select>

          <input
            name="startTime"
            type="datetime-local"
            onChange={handlePartyChange}
            className="p-2 border rounded"
          />
          <input
            name="endTime"
            type="datetime-local"
            onChange={handlePartyChange}
            className="p-2 border rounded"
          />
          <input
            name="logo"
            type="file"
            accept="image/*"
            onChange={handlePartyChange}
            className="p-2"
          />

          {logoPreview && (
            <img
              src={logoPreview}
              alt="Logo Preview"
              className="w-32 h-32 object-contain border rounded"
            />
          )}
        </div>
        <button
          onClick={createParty}
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Create Party
        </button>
      </div>

      {/* Create Candidate Form */}
      <div className="border p-6 rounded shadow bg-white">
        <h3 className="text-2xl font-bold mb-4 text-green-700">Create Candidate</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="name"
            placeholder="Candidate Name"
            onChange={handleCandidateChange}
            className="p-2 border rounded"
          />
          <input
            name="age"
            type="number"
            placeholder="Age"
            onChange={handleCandidateChange}
            className="p-2 border rounded"
          />
          <select
            name="party"
            value={candidateData.party}
            onChange={handleCandidateChange}
            className="p-2 border rounded"
          >
            <option value="">Select Party</option>
            {parties.map((p) => (
              <option key={p.name} value={p.name}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={createCandidate}
          className="mt-4 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
        >
          Create Candidate
        </button>
      </div>
    </div>
  );
}
