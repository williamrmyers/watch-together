import React, { Component } from 'react';
import ReactPlayer from 'react-player';
import { findDOMNode } from 'react-dom';
import openSocket from 'socket.io-client';
import { BrowserRouter, Route, Switch, Link, NavLink, Redirect} from 'react-router-dom';
// https://www.npmjs.com/package/react-id-generator
import idGenerator from 'react-id-generator';

const socket = openSocket('http://localhost:8080');

class App extends Component {
  render() {
    return (
      <div>
        <AppRouter />
      </div>
    )
  }
}

class Movie extends Component {
  constructor(props)
{
  super(props)
  socket.on('connect', () => {
    console.log('Connected to server.');
  });

  if (!this.state.isMaster) {
    socket.on('startMediaAt', (data) => {
      console.log(`Slave should start at`, data);
      this.setPlayTime(data.time.time);
      this.setState(() => ({startTime: data.time.time}))
    });
  }

  socket.on('disconnect', () => {
    console.log('Disconencted from server.');
  });
}

  state={
    startTime: 0,
    currentVideo: 'https://www.youtube.com/watch?v=GOQ1WG06jxg',
    playlist: ['https://www.youtube.com/watch?v=GOQ1WG06jxg', 'https://www.youtube.com/watch?v=7G-SvFN5C6M'],
    played: null,
    duration:0,
    isMaster: false
  }
componentDidMount() {

}

// NEEDED FUNCTIONS

  setStartTime = () => {
    // Send Master start time to server
    const currentTime = this.player.getCurrentTime();

    console.log(`Current time`, currentTime);
    socket.emit('masterSendStartTime', {
      time: currentTime
    });
  }
  // For clients, should test if
  // CurrentVideo === VideoFromMaster
  // currentTime === timeFromServer
  testCurentVideo = (data, state) => {
    if (this.state.currentVideo !== data.currentVideo) {
      this.setState(() => ({ currentVideo: data.currentVideo }));
    }

    if (this.state.startTime > data.time.time + 5 || this.state.startTime < data.time.time - 5) {
        this.setState(() => ({startTime: data.time.time}))
    }
  }

// get current playtime
  getTime = () => {
    console.log(this.player.getCurrentTime());
  }

// Get set Playtime
  setPlayTime = (data) => {
    this.player.seekTo(data);
  }

// set current Video
  handelSetMovie = (e) => {
    e.preventDefault();
    const currentVideo = e.target.elements.setMovie.value.trim();
    this.setState(() => ({ currentVideo }));
    e.target.elements.setMovie.value = '';
    }
// Add to playlist
  handelAddToPlaylist = (e, state) => {
    e.preventDefault();
    const video = e.target.elements.addToPlaylist.value.trim();
    this.setState(() => ({ playlist: [...this.state.playlist, video ] }));
    e.target.elements.addToPlaylist.value = '';
  }
  playItem = (e) => {
    console.log(e.target.innerHTML);
  }

  onDuration = (duration) => {
    console.log('onDuration', duration)
    this.setState({ duration });
  }

  toggelMaster = (state) => {
    this.setState(() => ({isMaster: this.state.isMaster? false : true}) )
  }

  ref = player => {
    this.player = player
  }

  render() {
    return (
      <div className="App">
      <ReactPlayer
        ref={this.ref}
        url={this.state.currentVideo}
        config={{ youtube: { playerVars: { showinfo: 0, start: this.state.startTime }}}}
        controls={true}
        playing={true}
        volume={true}
        muted={true}

        onReady={() => console.log('onReady')}
        onStart={() => console.log('onStart')}
        onPlay={this.onPlay}
        onPause={this.onPause}
        onBuffer={() => console.log('onBuffer')}
        onSeek={e => console.log('onSeek', e)}
        onEnded={this.onEnded}
        onError={e => console.log('onError', e)}
        onProgress={this.onProgress}
        onDuration={this.onDuration}
        onPlaying={this.onPlaying}
        />

      <button onClick={this.getTime}>Get Current time</button>
      <button onClick={this.setPlayTime}>Start at 1000 seconds</button>
      <button onClick={this.toggelMaster}>{this.state.isMaster?'Is Master':'Is Slave'}</button>
      <button onClick={this.setStartTime}>Set Start time</button>

        <form onSubmit={this.handelSetMovie}>
          <input autoComplete="off" type="text" name="setMovie" />
          <button>Set Movie</button>
        </form>

        <form onSubmit={this.handelAddToPlaylist}>
          <input autoComplete="off" type="text" name="addToPlaylist" />
          <button>Add to playlist</button>
        </form>

        <h3>Start time is {this.state.startTime}</h3>
        <List
          movies={this.state.playlist}
          playItem={this.playItem}
          />
      </div>
    );
  }
}

const AppRouter = () => (
  <BrowserRouter>
    <div>
      <Header />
      <Switch>
        <Route path="/" component={Home} exact={true}/>
        <Route path="/movie" component={Movie} exact={true}/>
        <Route path="/room/:id" component={Movie} exact={true}/>
        <Route component={NotFoundPage}/>
      </Switch>
    </div>
  </BrowserRouter>
);

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
      e.target.elements.addNewRoom.value = '';
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

const NotFoundPage = () => (
  <div>
    <p>Page Not found</p>
  </div>
);
const Room = () => (
  <div>
    <p>New Room</p>
  </div>
);

const Header = () => (
  <header>
    <h1>Watch Together</h1>
    <NavLink to="/" activeClassName="is-active" exact={true} >Home</NavLink><br/>
    <NavLink to="/movie" activeClassName="is-active" exact={true} >Movie</NavLink><br/>
  </header>
);


class List extends Component {
    render() {
      const movies = this.props.movies;
      return (
        <div>
          <ul>
            {
              movies.map((movie) => (<li key={movie} onClick={this.props.playItem}>{movie}</li>))
            }
          </ul>
        </div>
      )
  }
}

export default App;
