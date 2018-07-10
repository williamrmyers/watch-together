import React, { Component } from 'react';
import { Switch, Route, BrowserRouter, Link, NavLink } from 'react-router-dom';

import Home from './components/home';
import Room from './components/room';
import NotFoundPage from './components/notfound';

class Router extends Component {
  render() {
    const home = (props) => {
      return (
        <Home
          {...props}
          {...this.props}
        />
      );
    };
    const room = (props) => {
      return (
        <Room
          {...props}
          {...this.props}
        />
      );
    };
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/" component={home} exact={true} />
          <Route path="/room/:id" component={room} exact={true} />
          <Route component={NotFoundPage} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default Router;
