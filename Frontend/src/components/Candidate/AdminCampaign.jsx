import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlusCircle, FaUserPlus, FaUsers, FaTrash, FaEdit, FaTimesCircle } from 'react-icons/fa';

const AdminCampaign = () => {
  // State for forms
  const [partyData, setPartyData] = useState({ name: '', colorTheme: '#000000', startTime: '', endTime: '' });
  const [candidateData, setCandidateData] = useState({ name: '', age: '', party: '' });
  
  // State for editing
  const [editingParty, setEditingParty] = useState(null); // Will hold the party being edited
  const [editingCandidate, setEditingCandidate] = useState(null); // Will hold the candidate being edited

  // UI State
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [parties, setParties] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState({ party: false, candidate: false });
  const [message, setMessage] = useState('');

  // Fetch initial data
  useEffect(() => {
    fetchParties();
    fetchCandidates();
  }, []);

  const fetchParties = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE}/candidate/partylist`);
      setParties(res.data.parties || []);
    } catch (err) { console.error('Failed to fetch parties:', err); }
  };

  const fetchCandidates = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE}/candidate`);
      setCandidates(res.data.data || []);
    } catch (err) { console.error('Failed to fetch candidates:', err); }
  };

  // Handlers for form input changes
  const handlePartyChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'logo' && files?.[0]) {
      setLogoPreview(URL.createObjectURL(files[0]));
      setLogoFile(files[0]);
    } else {
      setPartyData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCandidateChange = (e) => {
    setCandidateData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // CRUD Operations for Parties
  const handlePartySubmit = async (e) => {
    e.preventDefault();
    setLoading(prev => ({ ...prev, party: true }));
    setMessage('');
    const token = localStorage.getItem('token');
    
    // Logic to either Update (PUT) or Create (POST)
    if (editingParty) {
        // UPDATE PARTY
        try {
            const utcStartTime = new Date(partyData.startTime).toISOString();
            const utcEndTime = new Date(partyData.endTime).toISOString();
            
            await axios.put(`${import.meta.env.VITE_API_BASE}/candidate/party/${editingParty._id}`, 
            { ...partyData, startTime: utcStartTime, endTime: utcEndTime }, 
            { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } });
            
            setMessage('Party updated successfully!');
            fetchParties();
            cancelEditParty();
        } catch (err) {
            setMessage(err.response?.data?.message || 'Failed to update party');
        }
    } else {
        // CREATE PARTY
        const formData = new FormData();
        const utcStartTime = new Date(partyData.startTime).toISOString();
        const utcEndTime = new Date(partyData.endTime).toISOString();
        formData.append('name', partyData.name);
        formData.append('colorTheme', partyData.colorTheme);
        formData.append('logo', logoFile);
        formData.append('startTime', utcStartTime);
        formData.append('endTime', utcEndTime);

        try {
            await axios.post(`${import.meta.env.VITE_API_BASE}/candidate/logo`, formData, {
                headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` }
            });
            setMessage('Party created successfully!');
            fetchParties();
            cancelEditParty(); // Resets the form
            e.target.reset();
        } catch (err) {
            setMessage(err.response?.data?.message || 'Failed to create party');
        }
    }
    setLoading(prev => ({ ...prev, party: false }));
  };

  const editParty = (party) => {
    setEditingParty(party);
    setPartyData({
        name: party.name,
        colorTheme: party.colorTheme,
        // The browser requires 'datetime-local' input in a specific format
        startTime: new Date(party.startTime).toISOString().slice(0, 16),
        endTime: new Date(party.endTime).toISOString().slice(0, 16)
    });
    setLogoPreview(party.logo); // Show existing logo
    setLogoFile(null); // Clear file input
  };
  
  const cancelEditParty = () => {
    setEditingParty(null);
    setPartyData({ name: '', colorTheme: '#000000', startTime: '', endTime: '' });
    setLogoPreview(null);
    setLogoFile(null);
  };

  const deleteParty = async (partyId, partyName) => {
    if (window.confirm(`Are you sure you want to delete ${partyName}? This will delete all its candidates and reset their votes.`)) {
        const token = localStorage.getItem('token');
        try {
            const res = await axios.delete(`${import.meta.env.VITE_API_BASE}/candidate/party/${partyId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage(res.data.message);
            fetchParties();
            fetchCandidates(); // Also refresh candidates
        } catch (err) {
            setMessage(err.response?.data?.message || 'Failed to delete party');
        }
    }
  };

  // CRUD Operations for Candidates
    const handleCandidateSubmit = async (e) => {
        e.preventDefault();
        setLoading(prev => ({ ...prev, candidate: true }));
        setMessage('');
        const token = localStorage.getItem('token');
        
        const url = editingCandidate 
            ? `${import.meta.env.VITE_API_BASE}/candidate/${editingCandidate._id}`
            : `${import.meta.env.VITE_API_BASE}/candidate`;
        
        const method = editingCandidate ? 'put' : 'post';

        try {
            await axios[method](url, candidateData, {
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
            });
            setMessage(editingCandidate ? 'Candidate updated successfully!' : 'Candidate created successfully!');
            fetchCandidates();
            cancelEditCandidate();
        } catch (err) {
            setMessage(err.response?.data?.message || `Failed to ${editingCandidate ? 'update' : 'create'} candidate`);
        }
        setLoading(prev => ({ ...prev, candidate: false }));
    };

    const editCandidate = (candidate) => {
        setEditingCandidate(candidate);
        setCandidateData({ name: candidate.name, age: candidate.age, party: candidate.party });
    };

    const cancelEditCandidate = () => {
        setEditingCandidate(null);
        setCandidateData({ name: '', age: '', party: '' });
    };

    const deleteCandidate = async (candidateId, candidateName) => {
        if (window.confirm(`Are you sure you want to delete candidate ${candidateName}?`)) {
            const token = localStorage.getItem('token');
            try {
                const res = await axios.delete(`${import.meta.env.VITE_API_BASE}/candidate/${candidateId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setMessage(res.data.message);
                fetchCandidates();
            } catch (err) {
                setMessage(err.response?.data?.message || 'Failed to delete candidate');
            }
        }
    };


  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-gray-800 mb-6 text-center">Campaign Dashboard</h2>
        {message && <p className={`mb-6 text-center p-3 rounded-lg shadow ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{message}</p>}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Parties Column */}
            <div className="space-y-8">
                <div className="bg-white rounded-xl shadow-lg p-8">
                    <h3 className="text-2xl font-bold mb-6 text-indigo-700 flex items-center justify-between">
                        <span>{editingParty ? 'Edit Party' : 'Create a New Party'}</span>
                        {editingParty && <button onClick={cancelEditParty} className="p-2 text-red-500 hover:text-red-700"><FaTimesCircle size="1.5em"/></button>}
                    </h3>
                    <form onSubmit={handlePartySubmit} className="space-y-4">
                        <input name="name" placeholder="Party Name" value={partyData.name} onChange={handlePartyChange} className="w-full p-3 border rounded-lg" required />
                        <input name="colorTheme" type="color" value={partyData.colorTheme} onChange={handlePartyChange} className="w-full h-12 p-1 border rounded-lg" title="Select theme color" />
                        <div className="grid grid-cols-2 gap-4">
                            <input name="startTime" type="datetime-local" value={partyData.startTime} onChange={handlePartyChange} className="w-full p-3 border rounded-lg" required title="Election Start Time" />
                            <input name="endTime" type="datetime-local" value={partyData.endTime} onChange={handlePartyChange} className="w-full p-3 border rounded-lg" required title="Election End Time" />
                        </div>
                        {!editingParty && <input name="logo" type="file" accept="image/*" onChange={handlePartyChange} className="w-full p-2 border rounded-lg" required />}
                        {logoPreview && <img src={logoPreview} alt="Logo Preview" className="w-24 h-24 object-contain mx-auto border rounded-lg mt-2" />}
                        <button type="submit" disabled={loading.party} className="w-full flex justify-center items-center py-3 px-4 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition duration-300 disabled:bg-indigo-400">
                           {editingParty ? <FaEdit className="mr-2" /> : <FaPlusCircle className="mr-2" />} {editingParty ? (loading.party ? 'Updating...' : 'Update Party') : (loading.party ? 'Creating...' : 'Create Party')}
                        </button>
                    </form>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-8">
                    <h3 className="text-2xl font-bold mb-6 text-gray-800">Existing Parties</h3>
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                        {parties.map(party => (
                            <div key={party._id} className="flex items-center justify-between p-4 border rounded-lg">
                                <div className="flex items-center">
                                    <img src={party.logo} alt={`${party.name} logo`} className="w-12 h-12 rounded-full object-cover mr-4" />
                                    <span className="font-semibold text-lg">{party.name}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button onClick={() => editParty(party)} className="p-3 text-blue-600 hover:text-blue-800 transition"><FaEdit size="1.2em"/></button>
                                    <button onClick={() => deleteParty(party._id, party.name)} className="p-3 text-red-600 hover:text-red-800 transition"><FaTrash size="1.2em"/></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            
            {/* Candidates Column */}
            <div className="space-y-8">
                <div className="bg-white rounded-xl shadow-lg p-8">
                    <h3 className="text-2xl font-bold mb-6 text-teal-700 flex items-center justify-between">
                        <span>{editingCandidate ? 'Edit Candidate' : 'Add a New Candidate'}</span>
                        {editingCandidate && <button onClick={cancelEditCandidate} className="p-2 text-red-500 hover:text-red-700"><FaTimesCircle size="1.5em"/></button>}
                    </h3>
                    <form onSubmit={handleCandidateSubmit} className="space-y-4">
                        <input name="name" placeholder="Candidate Name" value={candidateData.name} onChange={handleCandidateChange} className="w-full p-3 border rounded-lg" required />
                        <input name="age" type="number" placeholder="Age" value={candidateData.age} onChange={handleCandidateChange} className="w-full p-3 border rounded-lg" required />
                        <select name="party" value={candidateData.party} onChange={handleCandidateChange} className="w-full p-3 border rounded-lg" required>
                            <option value="">Select Party</option>
                            {parties.map((p) => <option key={p._id} value={p.name}>{p.name}</option>)}
                        </select>
                        <button type="submit" disabled={loading.candidate} className="w-full flex justify-center items-center py-3 px-4 bg-teal-600 text-white font-bold rounded-lg hover:bg-teal-700 transition disabled:bg-teal-400">
                            {editingCandidate ? <FaEdit className="mr-2" /> : <FaUserPlus className="mr-2" />} {editingCandidate ? (loading.candidate ? 'Updating...' : 'Update Candidate') : (loading.candidate ? 'Adding...' : 'Add Candidate')}
                        </button>
                    </form>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-8">
                    <h3 className="text-2xl font-bold mb-6 text-gray-800">Existing Candidates</h3>
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                        {candidates.map(candidate => (
                            <div key={candidate._id} className="flex items-center justify-between p-4 border rounded-lg">
                                <div>
                                    <p className="font-semibold text-lg">{candidate.name}</p>
                                    <p className="text-gray-600">{candidate.party}</p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button onClick={() => editCandidate(candidate)} className="p-3 text-blue-600 hover:text-blue-800 transition"><FaEdit size="1.2em"/></button>
                                    <button onClick={() => deleteCandidate(candidate._id, candidate.name)} className="p-3 text-red-600 hover:text-red-800 transition"><FaTrash size="1.2em"/></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCampaign;