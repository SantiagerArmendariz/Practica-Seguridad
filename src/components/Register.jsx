// Importa los hooks useState y useNavigate de React y react-router-dom respectivamente
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import CryptoJS from 'crypto-js';

// Componente Register que recibe la función setUser como prop
function Register({ setUser }) {
  // Define los estados locales para username, email, phone, password y error
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Función para validar el formato del email
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // Función para validar el formato de la contraseña
  const validatePassword = (password) => {
    const re = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{10,}$/;
    return re.test(password);
  };

  // Función que maneja el registro del usuario
  const handleRegister = () => {
    // Verifica que todos los campos estén llenos
    if (!username || !email || !phone) {
      setError('Todos los campos son obligatorios.');
      return;
    }
    // Verifica que el email sea válido
    if (!validateEmail(email)) {
      setError('Correo electrónico no válido.');
      return;
    }
    // Verifica que el teléfono tenga 10 dígitos y sea un número
    if (phone.length !== 10 || isNaN(phone)) {
      setError('El número de celular debe tener 10 dígitos.');
      return;
    }
    // Verifica que la contraseña cumpla con los requisitos
    if (!validatePassword(password)) {
      setError('La contraseña debe tener al menos 10 caracteres, contener al menos un número, un carácter especial y letras.');
      return;
    }

    // Encripta el username, email y phone, y hashea la contraseña
    const encryptedUsername = CryptoJS.AES.encrypt(username, 'secret_key').toString();
    const encryptedEmail = CryptoJS.AES.encrypt(email, 'secret_key').toString();
    const encryptedPhone = CryptoJS.AES.encrypt(phone, 'secret_key').toString();
    const hashedPassword = CryptoJS.SHA256(password).toString();

    // Guarda los datos encriptados en localStorage
    localStorage.setItem(encryptedUsername, JSON.stringify({ encryptedEmail, encryptedPhone, hashedPassword }));
    // Establece el usuario y navega a la página de chat
    setUser(username);
    navigate('/chat');
  };

  // Renderiza el formulario de registro
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

// Define los tipos de las props
Register.propTypes = {
  setUser: PropTypes.func.isRequired,
};

// Exporta el componente Register
export default Register;