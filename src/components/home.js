import React, { Component } from 'react';
import openSocket from 'socket.io-client';
import { Route, withRouter, Redirect } from 'react-router-dom';

import RoomList from './roomlist';

const socket = openSocket('http://localhost:8080');
// rooms: [
//   { id:1, name: 'Scary Movies', currentMovie: 'Fright Night', viewers: 82 },
//   { id:2, name: 'MURDER', currentMovie: 'Hostel', viewers: 39 },
//   { id:3, name: 'Nerd', currentMovie: 'StarTrek', viewers: 11 }
// ]

class Home extends React.Component {
  constructor(props) {
    super(props)

      socket.on('sendRoomList', (data) => {
        console.log('sendRoomList', data);
        this.setState(() => ({
          rooms: data.data
        }));
      });


    this.state = {
      rooms: []
    };
  }


  componentWillUpdate (props) {
    // console.log('shouldComponentUpdate');
    socket.on('sendRoomList', (data) => {
      // console.log('sendRoomList', data);
      this.setState(() => ({
        rooms: data.data
      }));
    });
    return true;
  }

  handelAddRoom = (e, state, props) => {
      e.preventDefault();
      const roomName = e.target.elements.roomName.value.trim();
      const nickName = e.target.elements.nickName.value.trim();
      const video = e.target.elements.video.value.trim();
      // console.log(roomName);
      if ("Validation") {
        this.props.history.push(`/room/${roomName}`);
        this.props.setRoomName({roomName, nickName, video});
      }
    }
  render () {
    return (
      <div>
        <h2>Create a room</h2>
          <form onSubmit={this.handelAddRoom}>
            <input autoComplete="off" placeholder="Room Name" type="text" name="roomName" />
            <input autoComplete="off" placeholder="Chat Nickname" type="text" name="nickName" />
            <input autoComplete="off" placeholder="Youtube Video" type="text" name="video" />
            <button>Create new Room</button>
          </form>

          <RoomList
            rooms={this.state.rooms}
            />
      </div>
    );
  }
};

export default Home;
