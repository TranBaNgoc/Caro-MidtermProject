import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Game from './components/Game';
import LoginView from './components/LoginView';
import RegisterView from './components/RegisterView';

import * as action from './actions/Game';
import './App.css';

const ls = require('localStorage');

class App extends React.Component {
  handleLogout = () => {
    ls.removeItem('user');
    const { onLogout } = this.props;
    onLogout();
  };

  render() {
    const user = ls.getItem('user');
    const components = [];
    if (user === null) {
      components.push(
        <Link
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
    } else {
      components.push(
        <Link to="/login">
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
            <Nav className="mr-auto">
              <></>
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

            <Route exact path="/">
              <Game />
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
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
