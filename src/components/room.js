import React, { Component } from 'react';
import ReactPlayer from 'react-player';
import { Link } from 'react-router-dom';
import openSocket from 'socket.io-client';
import idGenerator from 'react-id-generator';
import moment from 'moment';

import Playlist from './playlist';

const socket = openSocket('http://localhost:8080');

class Room extends Component {
  constructor(props)
{
  super(props);
  socket.on('connect', () => {
    console.log('Connected to server.');
  });

  socket.on('updateUserList' ,(data) => {
    console.log('updateUserList', data.rooms);
    this.creationData(data);
  });

  socket.on('disconnect', () => {
    console.log('Disconencted from server.');
  });
  console.log(this.props);
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

  componentDidMount(props) {
    const roomName = decodeURI(window.location.href.split("/")[4]);

    if (!this.props.isCreator) {
      this.joinRoom({roomName});
    }

    if (this.props.isCreator) {

      const createRoomData = { roomName: this.props.roomName, nickName: this.props.nickName, video: this.props.video }
      socket.emit('createRoom', createRoomData, (err) => {
        if (err) {
          alert(err);
        } else {
          console.log('No Error.');
        }
      });
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

  joinRoom = (roomName) => {
    socket.emit('join', roomName , (err) => {
      if (err) {
        alert(err);
      } else {
        console.log('No Error.');
      }
    });
  }

// get current playtime
  getTime = () => {
    console.log(this.player.getCurrentTime());
  }

// Get set Playtime
  setPlayTime = (data) => {
    this.player.seekTo(data);
  }

  syncMovie = (state) => {
    const currentTime = moment().unix();
    const startTime = this.state.startTime;
    const movieAt = currentTime - startTime;
    this.player.seekTo(movieAt);

    console.log({
      StartTime: startTime,
      currentTime,
      at: currentTime - startTime
    });
  }

// Add to playlist
  handelAddToPlaylist = (e, state) => {
    e.preventDefault();
    const video = e.target.elements.addToPlaylist.value.trim();
    this.setState(() => ({ playlist: [...this.state.playlist, video ] }));
    e.target.elements.addToPlaylist.value = '';
  }
  movieStarted = () => {
    console.log(`movieStarted`);
    this.syncMovie();
  }

  playItem = (e) => {
    console.log(e.target.innerHTML);
  }

  // onDuration = (duration) => {
  //   console.log('onDuration', duration)
  //   this.setState({ duration });
  // }

  ref = player => {
    this.player = player
  }

  render() {
    return (
      <div>
        <Link to="/" >Home</Link>
          <ReactPlayer
            ref={this.ref}
            url={this.state.currentVideo}
            config={{ youtube: { playerVars: { showinfo: 0 }}}}
            controls={true}
            playing={true}
            muted={true}

            onReady={() => console.log('onReady')}
            onStart={this.movieStarted}
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
        <br/>
        <br/>
        <button onClick={this.syncMovie}>Sync</button>

        <form onSubmit={this.handelAddToPlaylist}>
          <input autoComplete="off" type="text" name="addToPlaylist" />
          <button>Add to playlist</button>
        </form>

        <Playlist
          movies={this.state.playlist}
          playItem={this.playItem}
          />
      </div>
    );
  }
}

export default Room;
