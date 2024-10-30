// Importar las clases WebSocketServer y WebSocket del módulo 'ws'
import { WebSocketServer, WebSocket } from 'ws';

// Crear una instancia del servidor WebSocket en el puerto 8080
const wss = new WebSocketServer({ port: 8080 });

// Evento que se ejecuta cuando un cliente se conecta al servidor WebSocket
wss.on('connection', (ws) => {
  console.log('Nueva conexión establecida');

  // Evento que se ejecuta cuando el servidor recibe un mensaje del cliente
  ws.on('message', (data) => {
    try {
      // Parsear el mensaje recibido
      const messageData = JSON.parse(data.toString());
      
      // Verificar que el mensaje tenga el formato correcto
      if (!messageData.user || !messageData.message) {
        throw new Error('Formato de mensaje inválido');
      }

      // Reenviar el mensaje a todos los clientes conectados
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(messageData));
        }
      });
    } catch (error) {
      console.error('Error procesando mensaje:', error);
      try {
        // Enviar un mensaje de error al cliente que envió el mensaje inválido
        ws.send(JSON.stringify({
          user: 'Sistema',
          message: 'Error al procesar el mensaje'
        }));
      } catch (sendError) {
        console.error('Error al enviar mensaje de error:', sendError);
      }
    }
  });

  // Enviar un mensaje de bienvenida al cliente que se acaba de conectar
  try {
    ws.send(JSON.stringify({
      user: 'Sistema',
      message: 'Bienvenido al chat encriptado!'
    }));
  } catch (error) {
    console.error('Error al enviar mensaje de bienvenida:', error);
  }

  // Enviar un mensaje cada 5 segundos al cliente que se acaba de conectar
  const intervalId = setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) {
      try {
        ws.send(JSON.stringify({
          user: 'Sistema',
          message: 'Bienvenido al chat encriptado!'
        }));
      } catch (error) {
        console.error('Error al enviar mensaje periódico:', error);
      }
    }
  }, 5000);

  // Limpiar el intervalo cuando el cliente se desconecta
  ws.on('close', () => {
    clearInterval(intervalId);
  });
});

// Manejo de errores del servidor WebSocket
wss.on('error', (error) => {
  console.error('Error en el servidor WebSocket:', error);
});

// Mensaje que indica que el servidor WebSocket está escuchando en el puerto 8080
console.log('Servidor WebSocket escuchando en ws://localhost:8080');

// Exportar la instancia del servidor WebSocket
export default wss;