import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function Login() {
  const [formData, setFormData] = useState({ aadharcardNumber: '', password: '' });
  const [message, setMessage] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3000/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const result = await res.json();
if (res.ok) {
  login(result.token, result.user.role); // ✅ pass role
  navigate('/');
} else {
        setMessage(result.message || 'Login failed');
      }
    } catch (err) {
      setMessage('Server error');
    }
  };

  return (
    <div className="flex flex-col items-center mt-20">
      <h2 className="text-xl font-bold mb-4">Login</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <input name="aadharcardNumber" value={formData.aadharcardNumber} onChange={handleChange} placeholder="Aadhar Number" className="border p-2" />
        <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" className="border p-2" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2">Login</button>
      </form>
      <p className="mt-4 text-red-500">{message}</p>
    </div>
  );
}

export default Login;
