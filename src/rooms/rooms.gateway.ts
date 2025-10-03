import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true }) // allow frontend to connect
export class RoomsGateway {
  @WebSocketServer()
  server: Server;

  // when a user joins a room
  @SubscribeMessage('join-room')
  handleJoinRoom(
    @MessageBody() data: { roomId: string; userId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(data.roomId);
    client.to(data.roomId).emit('user-joined', data.userId);
  }

  // handle WebRTC signaling messages
@SubscribeMessage("signal")
handleSignal(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
  if (data.to) {
    this.server.to(data.to).emit("signal", data);
  } else {
    client.to(data.roomId).emit("signal", data);
  }
}

@SubscribeMessage("candidate")
handleCandidate(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
  if (data.to) {
    this.server.to(data.to).emit("candidate", data);
  } else {
    client.to(data.roomId).emit("candidate", data);
  }
}


  // when a user disconnects
  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }
}
