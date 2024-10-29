import { useState, useEffect, useRef } from 'react';
import CryptoJS from 'crypto-js';
import PropTypes from 'prop-types';

const ENCRYPTION_KEY = 'my-secret-key-2024';

function Chat({ user }) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const ws = useRef(null);

  useEffect(() => {
    // Conectar al servidor WebSocket
    try {
      ws.current = new WebSocket('ws://localhost:8080');

      ws.current.onopen = () => {
        console.log('Conectado al servidor WebSocket');
        setIsConnected(true);
        // Agregar mensaje de conexión exitosa
        setMessages(prev => [...prev, {
          user: 'Sistema',
          message: 'Conectado al chat'
        }]);
      };

      ws.current.onmessage = (event) => {
        try {
          const messageData = JSON.parse(event.data);
          
          // Si es un mensaje del sistema, mostrarlo sin desencriptar
          if (messageData.user === 'Sistema') {
            setMessages(prev => [...prev, messageData]);
            return;
          }

          // Desencriptar el mensaje
          const bytes = CryptoJS.AES.decrypt(messageData.message, ENCRYPTION_KEY);
          const decryptedMessage = bytes.toString(CryptoJS.enc.Utf8);

          if (decryptedMessage) {
            setMessages(prev => [...prev, {
              user: messageData.user,
              message: decryptedMessage
            }]);
          }
        } catch (error) {
          console.error('Error al procesar mensaje recibido:', error);
          setMessages(prev => [...prev, {
            user: 'Sistema',
            message: 'Error al procesar un mensaje recibido'
          }]);
        }
      };

      ws.current.onclose = () => {
        console.log('Desconectado del servidor WebSocket');
        setIsConnected(false);
        setMessages(prev => [...prev, {
          user: 'Sistema',
          message: 'Desconectado del chat'
        }]);
      };

      ws.current.onerror = (error) => {
        console.error('Error en la conexión WebSocket:', error);
        setMessages(prev => [...prev, {
          user: 'Sistema',
          message: 'Error en la conexión'
        }]);
      };
    } catch (error) {
      console.error('Error al establecer la conexión WebSocket:', error);
      setMessages([{
        user: 'Sistema',
        message: 'Error al conectar con el servidor'
      }]);
    }

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  const handleSendMessage = () => {
    if (!message.trim() || !ws.current || !isConnected) {
      return;
    }

    try {
      // Encriptar mensaje
      const encryptedMessage = CryptoJS.AES.encrypt(message, ENCRYPTION_KEY).toString();

      // Crear objeto del mensaje
      const messageObject = {
        user,
        message: encryptedMessage
      };

      // Enviar mensaje encriptado
      ws.current.send(JSON.stringify(messageObject));
      
      // Limpiar campo de mensaje
      setMessage('');
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      setMessages(prev => [...prev, {
        user: 'Sistema',
        message: 'Error al enviar el mensaje'
      }]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="p-4">
      <div className="border rounded p-4">
        <h2 className="text-xl font-bold mb-4">
          Chat {isConnected ? '(Conectado)' : '(Desconectado)'}
        </h2>
        
        {/* Área de mensajes */}
        <div className="h-96 overflow-y-auto mb-4 border rounded p-4">
          {messages.map((msg, index) => (
            <div 
              key={index} 
              className={`mb-2 p-2 rounded ${
                msg.user === 'Sistema'
                  ? 'bg-yellow-100 text-center'
                  : msg.user === user 
                    ? 'bg-blue-100 text-right' 
                    : 'bg-gray-100'
              }`}
            >
              <strong>{msg.user}:</strong> {msg.message}
            </div>
          ))}
        </div>

        {/* Área de entrada de mensaje */}
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 px-3 py-2 border rounded"
            placeholder={isConnected ? "Escribe un mensaje..." : "Conectando..."}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={!isConnected}
          />
          <button
            className={`px-4 py-2 rounded ${
              isConnected 
                ? 'bg-blue-500 text-white hover:bg-blue-600' 
                : 'bg-gray-400 text-gray-200'
            }`}
            onClick={handleSendMessage}
            disabled={!isConnected}
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
}

Chat.propTypes = {
  user: PropTypes.string.isRequired,
};

export default Chat;