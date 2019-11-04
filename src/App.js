import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Game from './components/Game';
import LoginView from './components/LoginView';
import RegisterView from './components/RegisterView';
import UpdateProfileView from './components/UpdateProfileView';
import Home from './components/Home';

import * as action from './actions/Game';
import './App.css';

const ls = require('localStorage');

class App extends React.Component {
  handleLogout = () => {
    ls.removeItem('token');
    ls.removeItem('displayname');
    const { onLogout } = this.props;
    onLogout();
  };

  leaveRoom = () => {
    const { onLeaveRoom } = this.props;
    onLeaveRoom();
  }

  render() {
    const { GameState } = this.props;
    const { onGame, user, winner } = GameState;
    const token = ls.getItem('token');
    const components = [];
    if (token === null || user === null) {
      components.push(
        <Link
          key="login"
          to="/login"
          style={{
            color: 'white',
            textDecoration: 'none',
            marginRight: '5px',
            marginLeft: '10px'
          }}
        >
          Login
        </Link>
      );
      components.push(
        <Link
          key="register"
          to="/register"
          style={{
            color: 'white',
            textDecoration: 'none',
            marginRight: '5px',
            marginLeft: '10px'
          }}
        >
          Register
        </Link>
      );
    } else if (!onGame) {
        components.push(
          <Link to="/profile" key="profile">
            <text
              style={{
                color: 'white',
                textDecoration: 'none',
                marginRight: '5px',
                marginLeft: '10px'
              }}
            >
              Profile
            </text>
          </Link>
        );

        components.push(
          <Link to="/login" key="logout">
            <text
              onClick={this.handleLogout}
              style={{
                color: 'white',
                textDecoration: 'none',
                marginRight: '5px',
                marginLeft: '10px'
              }}
            >
              Logout
            </text>
          </Link>
        );
      } else {
        components.push(
          <Link to="/" key="home">
            <text
              onClick={this.leaveRoom}
              style={{
                color: 'white',
                textDecoration: 'none',
                marginRight: '5px',
                marginLeft: '10px'
              }}
            >
              Leave room
            </text>
          </Link>
        );
      }

    return (
      <Router>
        <div>
          <Navbar bg="primary" variant="dark" style={{ height: '46px' }}>
            <Navbar.Brand>
              <Link
                to="/"
                style={{
                  color: 'white',
                  textDecoration: 'none',
                  marginRight: '5px'
                }}
              >
                XO - Caro
              </Link>
            </Navbar.Brand>
            <Nav className="mr-auto" style={{marginLeft: '35%', fontSize: '30px', color: 'white'}}> 
              <>{winner ? `Winner is ${winner}`: ""}</>
            </Nav>
            <Nav>
              <Link
                to="/"
                style={{
                  color: 'white',
                  textDecoration: 'none',
                  marginRight: '5px'
                }}
              >
                Home
              </Link>
              {components}
            </Nav>
          </Navbar>

          <Switch>
            <Route exact path="/login">
              <LoginView />
            </Route>
            <Route exact path="/register">
              <RegisterView />
            </Route>

            <Route exact path="/profile">
              <UpdateProfileView />
            </Route>
            <Route exact path="/game">
              <Game />
            </Route>
            <Route exact path="/">
              <Home />
            </Route>
          </Switch>
        </div>
      </Router>
    );
  }
}

const mapStateToProps = state => ({
  GameState: state.Game
});

const mapDispatchToProps = dispatch => {
  return {
    onLogout: () => {
      dispatch(action.Logout());
    },
    onLeaveRoom: () => {
      dispatch(action.LeaveRoom());
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
