import { useState } from 'react';
import axios from 'axios';

function AdminPanel() {
  const [form, setForm] = useState({ name: '', party: '', age: '' });
  const token = localStorage.getItem('token');

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = () => {
    axios.post('http://localhost:3000/candidate', form, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => alert('Candidate Added'))
      .catch(err => alert(err.response?.data?.message || "Error"));
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Admin - Add Candidate</h2>
      <input name="name" placeholder="Name" className="input" onChange={handleChange} />
      <input name="party" placeholder="Party" className="input" onChange={handleChange} />
      <input name="age" placeholder="Age" type="number" className="input" onChange={handleChange} />
      <button onClick={handleSubmit} className="px-4 py-2 bg-green-600 text-white mt-2 rounded">
        Add
      </button>
    </div>
  );
}

export default AdminPanel;
