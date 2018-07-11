import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { BrowserRouter, Route, Switch, Link, NavLink, Redirect} from 'react-router-dom';

import './App.css';

import Router from './router';

class App extends Component {

    state = {
      isLoggedIn: false,
      isCreator: false,

      roomName: false,
      nickName:false,
      video: false
    };

    setRoomName = (roomData) => {
      console.log(roomData);
      this.setState(() => ({
        roomName: roomData.roomName,
        nickName: roomData.nickName,
        video: roomData.video,
        isCreator: true
      }));
    }

  render() {
    return (
      <div className="App">
        <Router
          {...this.state}
          setRoomName={this.setRoomName}
        />
      </div>
    );
  }
}

// const AppRouter = () => (
//   <BrowserRouter>
//     <div>
//       <Header />
//       <Switch>
//         <Route path="/" component={Home} exact={true}/>
//         <Route path="/room/:id" component={Room} exact={true}/>
//         <Route component={NotFoundPage}/>
//       </Switch>
//     </div>
//   </BrowserRouter>
// );

const Header = () => (
  <header>
    <h1>Watch Together</h1>
    <NavLink to="/" activeClassName="is-active" exact={true} >Home</NavLink><br/>
  </header>
);

export default App;
