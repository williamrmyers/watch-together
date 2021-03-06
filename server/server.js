require('./config/config');

const express = require('express');
const bodyParser = require('body-parser')
const path = require('path');
const socketIO = require('socket.io');
const http = require('http');
const moment = require('moment');


const {mongoose} = require('./db/mongoose');
const {ObjectID} = require('mongodb');
const {Room} =require('./models/room');
const {Users} = require('./utils/users');
const users = new Users();

const port = process.env.PORT || 8080;
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// app.use(express.static(path.join(__dirname, '../build')));

if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, '../client/build')));

  // Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}


// const room = new Room({
//   name: 'Horror Town',
//   currentMediaStartedAt: 319.927359,
//   currentMedia: 'https://www.youtube.com/watch?v=qmJtzUGKkGI',
//   _creator: new ObjectID
// });
//
// console.log(room);
//
// room.save().then((doc)=>{
//   console.log(`Saved`, doc);
// }, (e)=>{
//   console.log(`There was an error`, e);
// });

io.on('connection', (socket) => {
  console.log('New user connected.');

  // Create room for creator
  socket.on('createRoom', (userData, callback) => {

      const room = new Room({
        name: userData.roomName,
        currentMediaStartedAt: moment().unix(),
        currentMedia: userData.video,
        _creator: new ObjectID
      });

      room.save().then((doc)=>{
        // console.log(`Saved`, doc);
        socket.join(userData.roomName);
        console.log('Created Room');

        // add to user object
        users.removeUser(socket.id);
        users.addUser(socket.id, userData.nickName, userData.roomName);

        // fetch rooms from mongoose
        Room.find({"name": userData.roomName}).then((data) => {
          io.to(userData.roomName).emit('updateUserList', { rooms: data ,users: users.getUserList(userData.roomName)});
        }, (e) => {
          console.log(`error getting rooms`, e);
        });
      }, (e)=>{
        console.log(`There was an error`, e);
        callback('Room already exists.');
      });
      callback();
  });
  // This query gets movies that were started at least 4 hours ago
  Room.find({  currentMediaStartedAt: { $gt: moment().unix() - 14400 }}).sort('-currentMediaStartedAt').then((data) => {
    socket.emit('sendRoomList', {data});
  }, (e) => {
    console.log(`error getting rooms`, e);
  });

  // Join Room for regular users.
  socket.on('join', (userData, callback) => {
    console.log(userData);

    io.in(userData.roomName).emit('newMessage', `${userData.nickName} Joined Chat.`);

    socket.join(userData.roomName);
    users.removeUser(socket.id);
    users.addUser(socket.id, userData.nickName, userData.roomName);

    Room.find({"name": userData.roomName }).then((data) => {
      console.log('Join room info', userData);
      io.in(userData.roomName).emit('updateUserList', { rooms: data ,users: users.getUserList(userData.roomName)});
    }, (e) => {
      console.log(`error getting rooms`, e);
    });

    // users.removeUser(socket.id);
    // users.addUser(socket.id, 'client name', userData.roomName);
    //
    // io.to(params.room).emit('updateUserList', users.getUserList(params.room));
    //
    //
    // socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
    // socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined chat!`));

    callback()
  });

  // Listen for messages from client
  socket.on('createMessage', (message, callback) => {
    let user = users.getUser(socket.id);
    console.log(user);

      io.to(user.room).emit('newMessage', `${user.name}: ${message.text}`);
      console.log(`${user.name}: ${message.text}`);
    // callback('This is from the server.');
  });

  socket.on('disconnect', () => {
    console.log('User disconected.');
    let user = users.removeUser(socket.id);

    if (user) {
      // Condition needs to be added to the front end to handle the fact that the other room data is not sent with this request
      // io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      io.to(user.room).emit('newMessage', `${user.name} has left the chat.`);
    }
  });
});

server.listen(port, () => {
  console.log(`Server is up on ${port}`);
});
