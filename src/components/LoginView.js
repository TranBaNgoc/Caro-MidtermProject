import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Spinner from 'react-bootstrap/Spinner';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {fetchLogin, fetchLoginFacebook} from '../actions/Login';

import '../App.css';

class LoginView extends React.Component {
  handleSubmit = e => {
    e.preventDefault();
    const { onFetchLogin, history } = this.props;
    Promise.resolve(
      onFetchLogin(e.target.username.value, e.target.password.value)
    ).then(isLogin => {
      if (isLogin) {
        history.push('/');
      }
    });
  };

  handleLoginFacebook = e => {
    e.preventDefault();
    const { onFetchLoginFacebook } = this.props;
    Promise.resolve(
      onFetchLoginFacebook()
    )
  };

  render() {
    const { GameState } = this.props;
    const { error, pending } = GameState;

    return (
      <div
        style={{ height: '90vh', display: 'flex', justifyContent: 'center' }}
      >
        <Form
          style={{ width: '50%', alignSelf: 'center', textAlign: 'center' }}
          onSubmit={this.handleSubmit}
        >
          <Form.Label style={{ fontSize: '20px' }}>SIGN IN</Form.Label>

          <Form.Group
            controlId="formBasicUsername"
            style={{ textAlign: 'left' }}
          >
            <Form.Label>Username</Form.Label>
            <Form.Control type="text" placeholder="beheocute" name="username" />
          </Form.Group>

          <Form.Group
            controlId="formBasicPassword"
            style={{ textAlign: 'left' }}
          >
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="******"
              name="password"
            />
          </Form.Group>

          <Form.Group>
            {error && !pending ? (
              <Form.Label style={{ color: 'red', fontStyle: 'italic' }}>
                {error}
              </Form.Label>
            ) : (
              ''
            )}

            {pending ? (
              <Spinner animation="border" role="status">
                <span className="sr-only">Loading...</span>
              </Spinner>
            ) : (
              ''
            )}
          </Form.Group>

          <Form.Group controlId="formBasicCheckbox">
            <Form.Check type="checkbox" label="Save password" />
          </Form.Group>

          <Form.Group>
            <Button variant="success" type="submit">
              Login
            </Button>
          </Form.Group>
          {/* <Form.Label>
            or
          </Form.Label>
          <Form.Group>
            
            <Button
              variant="primary"
              type="submit"
              onClick={this.handleLoginFacebook}
            >
              Facebook Login
            </Button>
            
          </Form.Group> */}

          {/* <Form.Group>
            
            <Button
              variant="danger"
              type="submit"
              onClick={this.handleLoginFacebook}
            >
              Google Login
            </Button>
            
          </Form.Group> */}
        </Form>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  GameState: state.Game
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      onFetchLogin: fetchLogin,
      onFetchLoginFacebook: fetchLoginFacebook
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(LoginView));
