import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlusCircle, FaUserPlus, FaUsers, FaTrash } from 'react-icons/fa';

const AdminCampaign = () => {
  const [partyData, setPartyData] = useState({
    name: '',
    colorTheme: '#000000',
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
  const [loading, setLoading] = useState({ party: false, candidate: false });
  const [message, setMessage] = useState({ party: '', candidate: '', general: '' });

  const handlePartyChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'logo' && files?.[0]) {
      setLogoPreview(URL.createObjectURL(files[0]));
      setPartyData(prev => ({ ...prev, logo: files[0] }));
    } else {
      setPartyData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCandidateChange = (e) => {
    setCandidateData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const createParty = async (e) => {
    e.preventDefault();
    setLoading(prev => ({ ...prev, party: true }));
    setMessage({ party: '', candidate: '', general: '' });
    const token = localStorage.getItem('token');
    const utcStartTime = new Date(partyData.startTime).toISOString();
    const utcEndTime = new Date(partyData.endTime).toISOString();
    const formData = new FormData();
    formData.append('name', partyData.name);
    formData.append('colorTheme', partyData.colorTheme);
    formData.append('logo', partyData.logo);
    formData.append('startTime', utcStartTime);
    formData.append('endTime', utcEndTime);

    try {
      await axios.post(`${import.meta.env.VITE_API_BASE}/candidate/logo`, formData, {
        headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` }
      });
      setMessage(prev => ({ ...prev, general: 'Party created successfully!' }));
      fetchParties();
      setPartyData({ name: '', colorTheme: '#000000', startTime: '', endTime: '', logo: null });
      setLogoPreview(null);
      e.target.reset();
    } catch (err) {
      setMessage(prev => ({ ...prev, party: err.response?.data?.message || 'Failed to create party' }));
    } finally {
      setLoading(prev => ({ ...prev, party: false }));
    }
  };

  const createCandidate = async (e) => {
    e.preventDefault();
    setLoading(prev => ({ ...prev, candidate: true }));
    setMessage({ party: '', candidate: '', general: '' });
    const token = localStorage.getItem('token');

    try {
      await axios.post(`${import.meta.env.VITE_API_BASE}/candidate`, candidateData, {
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
      });
      setMessage(prev => ({ ...prev, general: 'Candidate created successfully!' }));
      setCandidateData({ name: '', age: '', party: '' });
    } catch (err) {
      setMessage(prev => ({ ...prev, candidate: err.response?.data?.message || 'Failed to create candidate' }));
    } finally {
      setLoading(prev => ({ ...prev, candidate: false }));
    }
  };

  const fetchParties = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE}/candidate/partylist`);
      setParties(res.data.parties || []);
    } catch (err) {
      console.error('Failed to fetch parties:', err);
    }
  };
  
  const deleteParty = async (partyId, partyName) => {
    if (window.confirm(`Are you sure you want to delete the ${partyName} party? This will also delete all of its candidates and reset any votes cast for them.`)) {
        const token = localStorage.getItem('token');
        try {
            const res = await axios.delete(`${import.meta.env.VITE_API_BASE}/candidate/party/${partyId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage({ general: res.data.message, party: '', candidate: '' });
            fetchParties(); // Refresh the list of parties
        } catch (err) {
            setMessage({ general: err.response?.data?.message || 'Failed to delete party', party: '', candidate: '' });
        }
    }
  };

  useEffect(() => {
    fetchParties();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center">Campaign Management</h2>
        
        {message.general && <p className={`mb-6 text-center p-3 rounded-lg ${message.general.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{message.general}</p>}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Column 1: Create Party & Candidate */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold mb-6 text-indigo-700 flex items-center"><FaUsers className="mr-3" /> Create a New Party</h3>
              <form onSubmit={createParty} className="space-y-4">
                <input name="name" placeholder="Party Name" value={partyData.name} onChange={handlePartyChange} className="w-full p-3 border rounded-lg" required />
                <input name="colorTheme" type="color" value={partyData.colorTheme} onChange={handlePartyChange} className="w-full h-12 p-1 border rounded-lg" title="Select a theme color" />
                <div className="grid grid-cols-2 gap-4">
                  <input name="startTime" type="datetime-local" onChange={handlePartyChange} className="w-full p-3 border rounded-lg" required title="Election Start Time" />
                  <input name="endTime" type="datetime-local" onChange={handlePartyChange} className="w-full p-3 border rounded-lg" required title="Election End Time" />
                </div>
                <input name="logo" type="file" accept="image/*" onChange={handlePartyChange} className="w-full p-2 border rounded-lg" required/>
                {logoPreview && <img src={logoPreview} alt="Logo Preview" className="w-24 h-24 object-contain mx-auto border rounded-lg mt-2" />}
                <button type="submit" disabled={loading.party} className="w-full flex justify-center items-center py-3 px-4 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition duration-300 disabled:bg-indigo-400">
                  <FaPlusCircle className="mr-2" /> {loading.party ? 'Creating...' : 'Create Party'}
                </button>
                {message.party && <p className="mt-4 text-center text-red-500">{message.party}</p>}
              </form>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold mb-6 text-teal-700 flex items-center"><FaUserPlus className="mr-3" /> Add a New Candidate</h3>
              <form onSubmit={createCandidate} className="space-y-4">
                <input name="name" placeholder="Candidate Name" value={candidateData.name} onChange={handleCandidateChange} className="w-full p-3 border rounded-lg" required />
                <input name="age" type="number" placeholder="Age" value={candidateData.age} onChange={handleCandidateChange} className="w-full p-3 border rounded-lg" required />
                <select name="party" value={candidateData.party} onChange={handleCandidateChange} className="w-full p-3 border rounded-lg" required>
                  <option value="">Select Party</option>
                  {parties.map((p) => <option key={p._id} value={p.name}>{p.name}</option>)}
                </select>
                <button type="submit" disabled={loading.candidate} className="w-full flex justify-center items-center py-3 px-4 bg-teal-600 text-white font-bold rounded-lg hover:bg-teal-700 transition duration-300 disabled:bg-teal-400">
                  <FaUserPlus className="mr-2" /> {loading.candidate ? 'Adding...' : 'Add Candidate'}
                </button>
                {message.candidate && <p className="mt-4 text-center text-red-500">{message.candidate}</p>}
              </form>
            </div>
          </div>

          {/* Column 2: Existing Parties List */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-2xl font-bold mb-6 text-gray-800">Existing Parties</h3>
            {parties.length === 0 ? (
                <p className="text-gray-500 text-center py-10">No parties have been created yet.</p>
            ) : (
                <div className="space-y-4">
                    {parties.map(party => (
                        <div key={party._id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow">
                            <div className="flex items-center">
                                <img src={party.logo} alt={`${party.name} logo`} className="w-12 h-12 rounded-full object-cover mr-4" />
                                <span className="font-semibold text-lg">{party.name}</span>
                            </div>
                            <button 
                                onClick={() => deleteParty(party._id, party.name)}
                                className="p-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition duration-300"
                                title={`Delete ${party.name} Party`}
                            >
                                <FaTrash />
                            </button>
                        </div>
                    ))}
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCampaign;