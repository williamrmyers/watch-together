import React, { Component } from 'react';
import ReactPlayer from 'react-player';
import openSocket from 'socket.io-client';
import idGenerator from 'react-id-generator';

import Playlist from './playlist';

const socket = openSocket('http://localhost:8080');

class Room extends Component {
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
        <Playlist
          movies={this.state.playlist}
          playItem={this.playItem}
          />
      </div>
    );
  }
}

export default Room;
