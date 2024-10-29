import { WebSocketServer, WebSocket } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', (ws) => {
  console.log('Nueva conexión establecida');

  ws.on('message', (data) => {
    try {
      // Parsear el mensaje recibido
      const messageData = JSON.parse(data.toString());
      
      // Verificar que el mensaje tenga el formato correcto
      if (!messageData.user || !messageData.message) {
        throw new Error('Formato de mensaje inválido');
      }

      // Reenviar el mensaje encriptado a todos los clientes
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(messageData));
        }
      });
    } catch (error) {
      console.error('Error procesando mensaje:', error);
      try {
        ws.send(JSON.stringify({
          user: 'Sistema',
          message: 'Error al procesar el mensaje'
        }));
      } catch (sendError) {
        console.error('Error al enviar mensaje de error:', sendError);
      }
    }
  });

  // Enviar mensaje de bienvenida
  try {
    ws.send(JSON.stringify({
      user: 'Sistema',
      message: 'Bienvenido al chat encriptado!'
    }));
  } catch (error) {
    console.error('Error al enviar mensaje de bienvenida:', error);
  }

  // Enviar mensaje cada 5 segundos
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

console.log('Servidor WebSocket escuchando en ws://localhost:8080');

export default wss;