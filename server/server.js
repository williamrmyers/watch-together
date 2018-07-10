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

app.use(express.static(path.join(__dirname, '../build')));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '../build', './static/index.html'));
});




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

        // console.log(userData.roomName);
        // console.log("Garbage", users.getUserList(userData.roomName));

      }, (e)=>{
        console.log(`There was an error`, e);
        callback('Room already exists.');
      });
      callback();
  });

  Room.find({}).then((data) => {
    socket.emit('sendRoomList', {data});
  }, (e) => {
    console.log(`error getting rooms`, e);
  });

  // Join Room for regular users.
  socket.on('join', (userData, callback) => {
    console.log(userData);

    socket.join(userData.roomName);

    Room.find({"name": userData.roomName}).then((data) => {
      console.log('Join room info', userData);
      io.in(userData.roomName).emit('updateUserList', { rooms: data ,users: users.getUserList(userData.roomName)});
    }, (e) => {
      console.log(`error getting rooms`, e);
    });

    users.removeUser(socket.id);
    users.addUser(socket.id, 'client name', userData.roomName);
    //
    // io.to(params.room).emit('updateUserList', users.getUserList(params.room));
    //
    //
    // socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
    // socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined chat!`));

    callback()
  });
  // Should check that the movie is at the righ time.

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
