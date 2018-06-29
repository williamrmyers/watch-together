import React, { Component } from 'react';
import ReactPlayer from 'react-player';
import { findDOMNode } from 'react-dom';

class App extends Component {

  state={
    startTime: 0,
    currentVideo: 'https://www.youtube.com/watch?v=GOQ1WG06jxg',
    playlist: ['https://www.youtube.com/watch?v=GOQ1WG06jxg'],
    played: null,
    duration:0
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
        controls
        playing
        volume
        muted

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

        <form onSubmit={this.handelSetMovie}>
          <input type="text" name="setMovie" />
          <button>Set Movie</button>
        </form>
      </div>
    );
  }
}

export default App;
