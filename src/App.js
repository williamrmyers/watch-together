import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { BrowserRouter, Route, Switch, Link, NavLink, Redirect} from 'react-router-dom';
// https://www.npmjs.com/package/react-id-generator
import idGenerator from 'react-id-generator';

import Router from './router';

class App extends Component {

    state = {
      isLoggedIn: false,
      roomName: false,
      isCreator: false
    };

    loginCurrentUser = () =>{
      this.setState(() => ({ isLoggedIn: true }));
    }

    logoutCurrentUser = () =>{
      this.setState(() => ({ isLoggedIn: false }));
    }

    toggleLogin = (state) => {
      this.setState(() =>({ isLoggedIn: this.state.isLoggedIn? false : true }));
    }

    setRoomName = (roomName) => {
      this.setState(() => ({
        roomName,
        isCreator: true
      }));
    }



  render() {
    return (
      <div className="App">
        <Router
          {...this.state}
          loginCurrentUser={this.loginCurrentUser}
          logoutCurrentUser={this.logoutCurrentUser}
          toggleLogin={this.toggleLogin}
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
