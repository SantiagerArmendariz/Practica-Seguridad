import { useState, useEffect, useRef } from 'react';
import CryptoJS from 'crypto-js';
import PropTypes from 'prop-types';

const ENCRYPTION_KEY = 'my-secret-key-2024';

function Chat({ user, onLogout }) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket('ws://localhost:8080');

    ws.current.onopen = () => console.log('Connected to WebSocket');
    ws.current.onmessage = (event) => {
      const messageData = JSON.parse(event.data);
      let decryptedMessage;

      // Verificar si el mensaje es del sistema
      if (messageData.user === 'Sistema') {
        decryptedMessage = messageData.message; // No desencriptar mensajes del sistema
      } else {
        const bytes = CryptoJS.AES.decrypt(messageData.message, ENCRYPTION_KEY);
        decryptedMessage = bytes.toString(CryptoJS.enc.Utf8);
      }

      setMessages(prev => [...prev, { user: messageData.user, message: decryptedMessage }]);
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    const encryptedMessage = CryptoJS.AES.encrypt(message, ENCRYPTION_KEY).toString();
    ws.current.send(JSON.stringify({ user, message: encryptedMessage }));
    setMessage('');
  };

  return (
    <div className="p-4 w-full max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">Chat</h2>
      <div className="h-80 overflow-y-auto p-4 border rounded mb-4">
        {messages.map((msg, index) => (
          <div key={index} className={`p-2 ${msg.user === user ? 'bg-blue-200 text-right' : 'bg-gray-200'} rounded mb-2`}>
            <strong>{msg.user}</strong>: {msg.message}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full p-2 border rounded mb-2"
        placeholder="Escribe un mensaje..."
      />
      <button onClick={handleSendMessage} className="w-full bg-blue-500 text-white py-2 rounded mb-2">Enviar</button>
      <button onClick={onLogout} className="w-full bg-red-500 text-white py-2 rounded">Cerrar sesión</button>
    </div>
  );
}

Chat.propTypes = {
  user: PropTypes.string.isRequired,
  onLogout: PropTypes.func.isRequired,
};

export default Chat;