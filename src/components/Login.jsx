import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import CryptoJS from 'crypto-js';

/**
 * Componente de Login que permite a los usuarios iniciar sesión.
 * 
 * @param {Object} props - Las propiedades del componente.
 * @param {Function} props.setUser - Función para establecer el usuario autenticado.
 */
function Login({ setUser }) {
  // Estado para almacenar el identificador (nombre de usuario o correo electrónico) y la contraseña.
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  /**
   * Maneja el proceso de inicio de sesión.
   */
  const handleLogin = () => {
    console.log('handleLogin called');
    console.log('Identifier:', identifier);
    console.log('Password:', password);

    // Verifica si el identificador es un correo electrónico.
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
    let storedHashedPassword = null;
    let storedEncryptedEmail = null;
    let storedEncryptedPhone = null;

    // Recorre el almacenamiento local para encontrar el usuario correspondiente.
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const userData = JSON.parse(localStorage.getItem(key));
      const decryptedUsername = CryptoJS.AES.decrypt(key, 'secret_key').toString(CryptoJS.enc.Utf8);
      const decryptedEmail = CryptoJS.AES.decrypt(userData.encryptedEmail, 'secret_key').toString(CryptoJS.enc.Utf8);

      // Si el nombre de usuario o el correo electrónico coinciden, almacena los datos del usuario.
      if (decryptedUsername === identifier || decryptedEmail === identifier) {
        storedHashedPassword = userData.hashedPassword;
        storedEncryptedEmail = userData.encryptedEmail;
        storedEncryptedPhone = userData.encryptedPhone;
        break;
      }
    }

    console.log('Stored Hashed Password:', storedHashedPassword);

    // Hashea la contraseña ingresada por el usuario.
    const hashedPassword = CryptoJS.SHA256(password).toString();
    console.log('Hashed Password:', hashedPassword);

    // Compara la contraseña hasheada con la almacenada.
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

// Define los tipos de las propiedades del componente.
Login.propTypes = {
  setUser: PropTypes.func.isRequired,
};

export default Login;