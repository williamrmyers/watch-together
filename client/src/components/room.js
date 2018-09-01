import React, { Component } from 'react';
import ReactPlayer from 'react-player';
import { Link } from 'react-router-dom';
import openSocket from 'socket.io-client';
import moment from 'moment';
import Modal from 'react-modal';

import Playlist from './playlist';
import Chat from './chat';
import NameModal from './namemodal';

const socket = openSocket( process.env.PORT );

class Room extends Component {
  constructor(props)
{
  super(props);
  socket.on('connect', () => {
    console.log('Connected to server.');
  });

  socket.on('updateUserList' ,(data) => {
    console.log('updateUserList', data);
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
    currentMediaStartedAt:0,
    messages: [],
    userList: []
  }

  componentDidMount(props) {
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
    // Get new Messages
    socket.on(`newMessage`, (message) => {
    this.newMessage(message);
    // Scrolls to new message.
    document.getElementsByClassName("chat-box")[0].lastElementChild.scrollIntoView();
  });
  // Launch modal

  }

  creationData = (data) => {
    this.setState(() =>({
      startTime: data.rooms[0].currentMediaStartedAt,
      currentVideo: data.rooms[0].currentMedia,
      roomName: data.rooms[0].name,
      creator: data.rooms[0]._creator,
      userList: data.users
    }));
  }

  newMessage = (message, prevState) => {
    this.setState((prevState) => ({ messages: [...prevState.messages, { "nickName": "Test User", "text": message }] }));
  }

// Modal Functions
  handleSetName = (nickName) => {
    const roomName = decodeURI(window.location.href.split("/")[4]);

    if (!this.props.isCreator) {
      // Futire Validation
      // Throw error if Failure to Connect
      // Else
      // Join Room
      this.joinRoom({roomName, nickName});
    }
    // Alert User if Nickname Exisists already
    // Close Modal
    this.setState(() => ({ nickName }));
  }
  // Unused
  joinRoom = (userData) => {
    socket.emit('join', userData , (err) => {
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
  sendMessage = (message) => {
    socket.emit(`createMessage`, {
      text: message
    });
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
        <div className="body">
              <header className="flex-header">
                <ul className="navigation" role="navigation">
                {/*
                  <li><Link to="/"><img src="../watch-together-logo.svg" alt="watch-together-logo.svg"/></Link></li>
                  */}
                  <li><a href="/"><img src="../watch-together-logo.svg" alt="watch-together-logo.svg"/></a></li>
                </ul>
              </header>
              <main className="flex-main">
                  <nav className="flex-nav">

                  </nav>
                  <article className="flex-article video-main">
                    <h2 className="room-name">{this.state.roomName}</h2>
                      { this.state.currentVideo?
                        (<div>
                          <ReactPlayer
                        className='embed-container'
                        ref={this.ref}
                        url={this.state.currentVideo}
                        config={{ youtube: { playerVars: { showinfo: 0 }}}}
                        controls={true}
                        playing={true}
                        muted={false}
                        height={0}
                        width={'100%'}

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

                        <button onClick={this.syncMovie} name="sync" type="button">Sync</button>

                        </div>) : (null)}

                  </article>
                      <Chat
                        messages={this.state.messages}
                        setNickname={this.setNickname}
                        nickNameIsSet={!this.state.nickName}
                        sendMessage={this.sendMessage}
                        />
              </main>
        </div>
          {/*Design END*/}
          {/*
            Playlist feature to be added
          <form onSubmit={this.handelAddToPlaylist}>
            <input autoComplete="off" type="text" name="addToPlaylist" />
            <button>Add to playlist</button>
          </form>

          <Playlist
            movies={this.state.playlist}
            playItem={this.playItem}
            />
            */}
          <NameModal
            handleSetName={this.handleSetName}
            modalIsOpen={!this.state.nickName && !this.props.nickName}
            modalMessage={""}
            />
      </div>
    );
  }
}

export default Room;
