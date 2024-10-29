import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import CryptoJS from 'crypto-js';

function Register({ setUser }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = () => {
    const hashedPassword = CryptoJS.SHA256(password).toString();
    localStorage.setItem(username, hashedPassword);
    setUser(username);
    navigate('/chat');
  };

  return (
    <div className="w-80 p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-full p-2 border rounded mb-2"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      />
      <button onClick={handleRegister} className="w-full bg-blue-500 text-white py-2 rounded mb-2">Register</button>
      <p className="text-center">
        Already have an account? <Link to="/login" className="text-blue-500">Login</Link>
      </p>
    </div>
  );
}

Register.propTypes = {
  setUser: PropTypes.func.isRequired,
};

export default Register;