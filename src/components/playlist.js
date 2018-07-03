import React, { Component } from 'react';

class Playlist extends Component {
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

export default Playlist;
