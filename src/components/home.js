import React, { Component } from 'react';
import openSocket from 'socket.io-client';

import RoomList from './roomlist';

const socket = openSocket('http://localhost:8080');

class Home extends React.Component {
  state = {
    rooms: [
      { id:1, name: 'Scary Movies', currentMovie: 'Fright Night', viewers: 82 },
      { id:2, name: 'MURDER', currentMovie: 'Hostel', viewers: 39 },
      { id:3, name: 'Nerd', currentMovie: 'StarTrek', viewers: 11 }
    ]
  }

  handelAddRoom = (e, state) => {
      e.preventDefault();
      const roomName = e.target.elements.addNewRoom.value.trim();
      console.log(roomName);

      // Joining room
      socket.emit('join', roomName, (err) => {
        if (err) {
          alert(err);
        } else {
          console.log('No Error.');
          // e.target.elements.addNewRoom.value = '';
        }
      });
    }
  render () {
    return (
      <div>
        <h2>Create a room</h2>
          <form onSubmit={this.handelAddRoom}>
            <input autoComplete="off" placeholder="Room Name" type="text" name="addNewRoom" />
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
