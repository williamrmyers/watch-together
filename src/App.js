import React, { Component } from 'react';
import ReactPlayer from 'react-player';
import { findDOMNode } from 'react-dom';
import openSocket from 'socket.io-client';

const socket = openSocket('http://localhost:8080');

class App extends Component {

  state={
    startTime: 0,
    currentVideo: 'https://www.youtube.com/watch?v=GOQ1WG06jxg',
    playlist: ['https://www.youtube.com/watch?v=GOQ1WG06jxg'],
    played: null,
    duration:0,
    isMaster: false
  }
componentDidMount() {
  socket.on('connect', () => {
    console.log('Connected to server.');
  });

  socket.on('disconnect', () => {
    console.log('Disconencted from server.');
  });
}

// NEEDED FUNCTIONS

// get current playtime
  getTime = () => {
    console.log(this.player.getCurrentTime());
  }

// Get set Playtime
  setPlayTime = (state) => {
    this.player.seekTo(1000)
  }

// set current Video
  handelSetMovie = (e) => {
    e.preventDefault();
    const currentVideo = e.target.elements.setMovie.value.trim();
    this.setState(() => ({ currentVideo }));
    e.target.elements.setMovie.value = '';
    }
// Add to playlist

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
      <p>{this.getCurrentTime}</p>
      <button onClick={this.getTime}>Get Current time</button>
      <button onClick={this.setPlayTime}>Start at 1000 seconds</button>
      <button onClick={this.toggelMaster}>{this.state.isMaster?'Is Master':'Is Slave'}</button>

        <form onSubmit={this.handelSetMovie}>
          <input type="text" name="setMovie" />
          <button>Set Movie</button>
        </form>
      </div>
    );
  }
}

export default App;
