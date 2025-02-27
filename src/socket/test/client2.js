import { io } from 'socket.io-client';

console.log('Connecting to server...');

const socket = io('http://localhost:7000');

socket.on('connect', () => {
  console.log('Connected to server.');
  socket.emit('join', { userId: 'UserID2' });
  socket.on('incoming-call', (data) => {
    console.log(data);
  })
});


socket.on('disconnect', () => {
  console.log('Disconnected from server.');
});
