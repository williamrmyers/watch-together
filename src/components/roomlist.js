import React, { Component } from 'react';

class RoomList extends Component {
  // { id:1, name: 'Scarry Movies', currentMovie: 'Fright Night', viewers: 82 }
    render() {
      const rooms = this.props.rooms;
      return (
        <div>
          <ul>
            {
              rooms.map((room) => (<li key={room.id} onClick={this.props.playItem}><strong>{room.name}</strong>: currently Playing {room.currentMovie} {room.viewers} watching</li>))
            }
          </ul>
        </div>
      )
  }
}

export default RoomList;
