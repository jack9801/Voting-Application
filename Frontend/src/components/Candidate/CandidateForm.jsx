import { useState } from 'react';

function CandidateForm() {
  const [form, setForm] = useState({
    name: '',
    age: '',
    party: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');

    try {
      const res = await fetch('http://localhost:3000/candidate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        alert('Candidate saved successfully!');
      } else {
        alert(data.message || 'Error saving candidate');
      }
    } catch (err) {
      alert('Server error');
      console.log(err);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Create/Update Candidate</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Name"
          className="w-full p-2 border"
        />
        <input
          name="age"
          value={form.age}
          onChange={handleChange}
          placeholder="Age"
          type="number"
          className="w-full p-2 border"
        />
        <input
          name="party"
          value={form.party}
          onChange={handleChange}
          placeholder="Party"
          className="w-full p-2 border"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Save Candidate
        </button>
      </form>
    </div>
  );
}

export default CandidateForm;
