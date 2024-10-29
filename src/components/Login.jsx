import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import CryptoJS from 'crypto-js';

function Login({ setUser }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    console.log('handleLogin called');
    console.log('Username:', username);
    console.log('Password:', password);

    const storedHashedPassword = localStorage.getItem(username);
    console.log('Stored Hashed Password:', storedHashedPassword);

    const hashedPassword = CryptoJS.SHA256(password).toString();
    console.log('Hashed Password:', hashedPassword);

    if (storedHashedPassword === hashedPassword) {
      setUser(username);
      navigate('/chat');
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <div className="w-80 p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
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
      <button onClick={handleLogin} className="w-full bg-blue-500 text-white py-2 rounded mb-2">Login</button>
      <p className="text-center">
        Don’t have an account? <Link to="/register" className="text-blue-500">Register</Link>
      </p>
    </div>
  );
}

Login.propTypes = {
  setUser: PropTypes.func.isRequired,
};

export default Login;