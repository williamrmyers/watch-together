const express = require('express');
const bodyParser = require('body-parser')
const path = require('path');
const socketIO = require('socket.io');
const http = require('http');


const {mongoose} = require('./db/mongoose');
const {ObjectID} = require('mongodb');
const {Room} =require('./models/room');

const port = process.env.PORT || 8080;
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(path.join(__dirname, '../build')));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '../build', './static/index.html'));
});


io.on('connection', (socket) => {
  console.log('New user connected.');

  // Listens for time from Master
  socket.on('masterSendStartTime', (time) => {
    console.log('master is at', time);
    // Should save to DB

    // Sends data to slaves
    socket.broadcast.emit('startMediaAt', {
      time: time
    });
  });

  socket.on('disconnect', () => {
    console.log('User disconected.');
  });
});

server.listen(port, () => {
  console.log(`Server is up on ${port}`);
});
