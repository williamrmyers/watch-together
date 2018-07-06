import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, Link, NavLink, Redirect} from 'react-router-dom';

class RoomList extends Component {
  // { id:1, name: 'Scarry Movies', currentMovie: 'Fright Night', viewers: 82 }
    render() {
      const rooms = this.props.rooms;
      return (
        <div>
          <ul>
            {
              rooms.map((room) => (<li key={room._id} onClick={this.props.playItem}><strong><Link to={{ pathname: '/room/' + room.name}}>{room.name}</Link></strong>: currently Playing <br/></li>))
            }
          </ul>
        </div>
      )
  }
}

export default RoomList;
