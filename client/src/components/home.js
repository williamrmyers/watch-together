import React, { Component } from 'react';
import openSocket from 'socket.io-client';
import { Route, withRouter, Redirect, Link } from 'react-router-dom';

import RoomList from './roomlist';

const socket = openSocket( process.env.PORT );
// rooms: [
//   { id:1, name: 'Scary Movies', currentMovie: 'Fright Night', viewers: 82 },
//   { id:2, name: 'MURDER', currentMovie: 'Hostel', viewers: 39 },
//   { id:3, name: 'Nerd', currentMovie: 'StarTrek', viewers: 11 }
// ]

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.getRoomList();

    this.state = {
      rooms: []
    };
  }


  componentDidMount (props) {
    this.getRoomList();
  }

  getRoomList = () => {
    // console.log('shouldComponentUpdate');
    socket.on('sendRoomList', (data) => {
      console.log('sendRoomList', data);
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
        <div className="body">
          <header className="flex-header">
            <ul className="navigation" role="navigation">
            <li><Link to="/" ><img src="watch-together-logo.svg" alt=""/></Link></li>
            <li className="add-room-form">
                <form onSubmit={this.handelAddRoom}>
                  <input autoComplete="off" placeholder="Room Name" type="text" name="roomName" />
                  <input autoComplete="off" placeholder="Chat Nickname" type="text" name="nickName" />
                  <input autoComplete="off" placeholder="Youtube Video" type="text" name="video" />
                  <button>Add Room</button>
                </form>
            </li>
            </ul>
          </header>
          <main className="flex-main">
              <nav className="flex-nav">

              </nav>
              <article className="flex-article">
                <h2>ROOMS</h2>
                  <p>Watch Videos with your friends (or Strangers). Add a link to <a target="_blank" href="https://www.youtube.com/">Youtube</a>  ,<a target="_blank" href="https://vimeo.com/">Vimeo</a> or <a target="_blank" href="https://soundcloud.com/">Soundcloud</a>. Checkout <a target="_blank" href="https://www.reddit.com/r/fullmoviesonyoutube/">/r/fullmoviesonyoutube</a></p>

                  <RoomList
                    rooms={this.state.rooms}
                    />

              </article>
              <aside className="flex-aside">

              </aside>
          </main>
        </div>
    );
  }
};

export default Home;
