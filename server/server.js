const express = require('express');
const bodyParser = require('body-parser')
const path = require('path');
const socketIO = require('socket.io');
const http = require('http');

const port = process.env.PORT || 8080;
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(path.join(__dirname, '../build')));

app.get('/ping', function (req, res) {
 return res.send('pong');
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '../build', './static/index.html'));
});


// io.on('connection', (client) => {
//   // here you can start emitting events to the client
//   console.log();
// });

io.on('connection', (socket) => {
  console.log('New user connected.');

  socket.on('disconnect', () => {
    console.log('User disconected.');
  });
});





server.listen(port, () => {
  console.log(`Server is up on ${port}`);
});
