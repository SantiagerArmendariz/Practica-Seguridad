import { useState } from 'react';
import PropTypes from 'prop-types';
import CryptoJS from 'crypto-js';

function Register({ setUser }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = () => {
    const hashedPassword = CryptoJS.SHA256(password).toString();
    localStorage.setItem(username, hashedPassword);
    setUser(username);
  };

  return (
    <div>
      <h2>Register</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleRegister}>Register</button>
    </div>
  );
}

Register.propTypes = {
  setUser: PropTypes.func.isRequired,
};

export default Register;