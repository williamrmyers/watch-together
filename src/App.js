import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { BrowserRouter, Route, Switch, Link, NavLink, Redirect} from 'react-router-dom';
// https://www.npmjs.com/package/react-id-generator
import idGenerator from 'react-id-generator';

import Home from './components/home';
import Room from './components/room';
import NotFoundPage from './components/notfound';

const AppRouter = () => (
  <BrowserRouter>
    <div>
      <Header />
      <Switch>
        <Route path="/" component={Home} exact={true}/>
        <Route path="/room/:id" component={Room} exact={true}/>
        <Route component={NotFoundPage}/>
      </Switch>
    </div>
  </BrowserRouter>
);

const Header = () => (
  <header>
    <h1>Watch Together</h1>
    <NavLink to="/" activeClassName="is-active" exact={true} >Home</NavLink><br/>
  </header>
);

export default AppRouter;
