import React, { Component } from 'react';
import ReactPlayer from 'react-player';
import { Link } from 'react-router-dom';
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

  socket.on('updateUserList' ,(data) => {
    console.log(data);
    this.creationData(data);
    // this.joinData(data);
    console.log('updateUserList: ',data);
    // const currentVideo = data.rooms.currentMedia;
    // const startTime = data.rooms.currentMediaStartedAt;
  });

  socket.on('disconnect', () => {
    console.log('Disconencted from server.');
  });
}

  state={
    startTime: 0,
    currentVideo: false,
    playlist: [],
    played: null,
    duration: 0,
    creator: false,
    roomName: false,
    nickName: false,
    timeToStart:0,
    currentMediaStartedAt:0
  }

  componentDidMount(state) {
    const roomName = window.location.href.split("/")[4];

    if (!this.state.creator) {
      this.joinRoom({roomName});
    }
  }

  creationData = (data) => {
    this.setState(() =>({
      startTime: data.rooms[0].currentMediaStartedAt,
      currentVideo: data.rooms[0].currentMedia,
      roomName: data.rooms[0].room,
      creator: data.rooms[0]._creator,
      nickName: data.users
    }))
  }

  joinData = (data) => {
    console.log(`joinData: `, data);
    this.setState(() =>({
      startTime: data.rooms[0].currentMediaStartedAt,
      currentVideo: data.rooms[0].currentMedia,
      roomName: data.rooms[0].room,
      creator: data.rooms[0]._creator,
      nickName: data.users
    }))
  }

  joinRoom = (roomName) => {
    socket.emit('join', { roomName: roomName }, (err) => {
      if (err) {
        alert(err);
      } else {
        console.log('No Error.');
      }
    });
  }


  // For clients, should test if
  // CurrentVideo === VideoFromMaster
  // currentTime === timeFromServer
  // testCurentVideo = (data, state) => {
  //   if (this.state.currentVideo !== data.currentVideo) {
  //     this.setState(() => ({ currentVideo: data.currentVideo }));
  //   }
  //
  //   if (this.state.startTime > data.time + 5 || this.state.startTime < data.time - 5) {
  //       // this.setState(() => ({startTime: data.time.time}))
  //       this.setPlayTime(data.time.time);
  //   }
  // }

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

  // onDuration = (duration) => {
  //   console.log('onDuration', duration)
  //   this.setState({ duration });
  // }

  handelAddRoom = (e, state) => {
      e.preventDefault();
      const roomName = e.target.elements.roomName.value.trim();
      const nickName = e.target.elements.nickName.value.trim();
      const video = e.target.elements.video.value.trim();

      // Creating room
      socket.emit('createRoom', { roomName, nickName, video}, (err) => {
        if (err) {
          alert(err);
        } else {
          console.log('No Error.');
          this.setState(() => ({creator: true }));
          // e.target.elements.addNewRoom.value = '';
        }
      });
    }

  ref = player => {
    this.player = player
  }

  render() {
    return (
      <div>
        <Link to="/" >Home</Link>
        <h2>Create a room</h2>
          <form onSubmit={this.handelAddRoom}>
            <input autoComplete="off" placeholder="Room Name" type="text" value={window.location.href.split("/")[4]} name="roomName" />
            <input autoComplete="off" placeholder="Chat Nickname" type="text" name="nickName" />
            <input autoComplete="off" placeholder="Youtube Video" type="text" name="video" />
            <button>Start Movie</button>
          </form>

          <ReactPlayer
            ref={this.ref}
            url={this.state.currentVideo}
            config={{ youtube: { playerVars: { showinfo: 0, start: this.state.timeToStart }}}}
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
      <button onClick={this.setStartTime}>Set Start time</button>

        <form onSubmit={this.handelSetMovie}>
          <input autoComplete="off" type="text" name="setMovie" />
          <button>Set Movie</button>
        </form>
        <button>Start Movie</button>

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
