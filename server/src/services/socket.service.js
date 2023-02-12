import { Server } from 'socket.io';

export default class SocketService {
  static io;

  static initialize(server) {
    this.io = new Server(server, {
      cors: {
        origin: "*",
      },
    });

    this.io.on('connection', (socket) => {
      console.info(socket.id);
    })
  }
}
