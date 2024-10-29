import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import CryptoJS from 'crypto-js';

function Register({ setUser }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePassword = (password) => {
    const re = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{10,}$/;
    return re.test(password);
  };

  const handleRegister = () => {
    if (!username || !email || !phone) {
      setError('Todos los campos son obligatorios.');
      return;
    }
    if (!validateEmail(email)) {
      setError('Correo electrónico no válido.');
      return;
    }
    if (phone.length !== 10 || isNaN(phone)) {
      setError('El número de celular debe tener 10 dígitos.');
      return;
    }
    if (!validatePassword(password)) {
      setError('La contraseña debe tener al menos 10 caracteres, contener al menos un número, un carácter especial y letras.');
      return;
    }

    const encryptedUsername = CryptoJS.AES.encrypt(username, 'secret_key').toString();
    const encryptedEmail = CryptoJS.AES.encrypt(email, 'secret_key').toString();
    const encryptedPhone = CryptoJS.AES.encrypt(phone, 'secret_key').toString();
    const hashedPassword = CryptoJS.SHA256(password).toString();

    localStorage.setItem(encryptedUsername, JSON.stringify({ encryptedEmail, encryptedPhone, hashedPassword }));
    setUser(username);
    navigate('/chat');
  };

  return (
    <div className="w-80 p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-full p-2 border rounded mb-2"
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-2 border rounded mb-2"
      />
      <input
        type="text"
        placeholder="Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
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