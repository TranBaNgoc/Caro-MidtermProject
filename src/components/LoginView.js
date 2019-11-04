import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Spinner from 'react-bootstrap/Spinner';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import fetchLoginAction from '../actions/Login';

import '../App.css';

class LoginView extends React.Component {
  handleSubmit = e => {
    e.preventDefault();
    const { fetchLogin, history } = this.props;
    Promise.resolve(
      fetchLogin(e.target.username.value, e.target.password.value)
    ).then(isLogin => {
      if (isLogin) {
        history.push('/');
      }
    });
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
              <Spinner
                animation="border"
                role="status"
              >
                <span className="sr-only">Loading...</span>
              </Spinner>
            ) : (
              ''
            )}
          </Form.Group>
          
          <Form.Group controlId="formBasicCheckbox">
            <Form.Check type="checkbox" label="Save password" />
          </Form.Group>

          <Button variant="primary" type="submit">
            Login
          </Button>
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
      fetchLogin: fetchLoginAction
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(LoginView));
