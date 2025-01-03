import { io } from 'socket.io-client';

const socket = io('http://localhost:7000');

socket.on('connect', () => {
  console.log('Connected to server.');
  socket.emit('join', { userId: 'UserID1' });
  // socket.emit('send-message', { to: 'UserID1', from: 'UserID2', text: 'Hello!' });
  socket.emit('typing', { to: 'UserID1', from: 'UserID2' });
  socket.emit('stop-typing', { to: 'UserID1', from: 'UserID2' });
});

socket.on('received-message', (message) => {
  console.log('Recieved message:', message);
});

socket.on('disconnect', () => {
  console.log('Disconnected from server.');
});
