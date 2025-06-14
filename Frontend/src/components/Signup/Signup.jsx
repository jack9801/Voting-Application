import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    aadharcardNumber: '',
    password: '',
    age: '',
    mobile: '',
    role: 'voter' // default
  });

  const [message, setMessage] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    const { name, email, aadharcardNumber, password, age, mobile, role } = formData;

    // ✅ Frontend validation
    if (!name || !email || !aadharcardNumber || !password || !age || !mobile || !role) {
      setMessage('All fields are required');
      return;
    }

    // ✅ Optional: Validate Aadhar
    if (!/^\d{12}$/.test(aadharcardNumber)) {
      setMessage('Aadhar must be 12 digits');
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/user/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const result = await res.json();
      console.log("✅ Backend response:", result);

      if (res.ok) {
        login(result.token); // set token to localStorage/context
        navigate('/login'); // redirect after signup
      } else {
        setMessage(result.message || result.error || 'Signup failed');
      }
    } catch (err) {
      console.error(err);
      setMessage('Server error');
    }
  };

  return (
    <div className="flex flex-col items-center mt-20">
      <h2 className="text-xl font-bold mb-4">Signup</h2>
      <form onSubmit={handleSignup} className="space-y-4">
        <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" className="border p-2" />
        <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="border p-2" />
        <input name="aadharcardNumber" value={formData.aadharcardNumber} onChange={handleChange} placeholder="Aadhar Number" className="border p-2" />
        <input name="age" value={formData.age} onChange={handleChange} placeholder="Age" className="border p-2" />
        <input name="mobile" value={formData.mobile} onChange={handleChange} placeholder="Mobile" className="border p-2" />

        <select name="role" value={formData.role} onChange={handleChange} className="border p-2">
          <option value="voter">voter</option>
          <option value="Admin">Admin</option>
        </select>

        <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" className="border p-2" />

        <button type="submit" className="bg-green-600 text-white px-4 py-2">Signup</button>
      </form>

      {message && <p className="mt-4 text-red-500">{message}</p>}
    </div>
  );
}

export default Signup;
