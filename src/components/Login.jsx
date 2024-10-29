import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import CryptoJS from 'crypto-js';

function Login({ setUser }) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    console.log('handleLogin called');
    console.log('Identifier:', identifier);
    console.log('Password:', password);

    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
    let storedHashedPassword = null;
    let storedEncryptedEmail = null;
    let storedEncryptedPhone = null;

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const userData = JSON.parse(localStorage.getItem(key));
      const decryptedUsername = CryptoJS.AES.decrypt(key, 'secret_key').toString(CryptoJS.enc.Utf8);
      const decryptedEmail = CryptoJS.AES.decrypt(userData.encryptedEmail, 'secret_key').toString(CryptoJS.enc.Utf8);

      if (decryptedUsername === identifier || decryptedEmail === identifier) {
        storedHashedPassword = userData.hashedPassword;
        storedEncryptedEmail = userData.encryptedEmail;
        storedEncryptedPhone = userData.encryptedPhone;
        break;
      }
    }

    console.log('Stored Hashed Password:', storedHashedPassword);

    const hashedPassword = CryptoJS.SHA256(password).toString();
    console.log('Hashed Password:', hashedPassword);

    if (storedHashedPassword === hashedPassword) {
      setUser(identifier);
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
        placeholder="Username or Email"
        value={identifier}
        onChange={(e) => setIdentifier(e.target.value)}
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