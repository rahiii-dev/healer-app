import { io } from 'socket.io-client';

const socket = io('http://localhost:7000');

socket.on('connect', () => {
  console.log('Connected to server.');
  socket.emit('join', { userId: 'UserID1' });
  socket.emit('start-call', { to: 'UserID2', from: 'UserID1'});
});

socket.on('received-message', (message) => {
  console.log('Recieved message:', message);
});

socket.on('disconnect', () => {
  console.log('Disconnected from server.');
});
