import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Spinner from 'react-bootstrap/Spinner';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import fetchRegisterAction from '../actions/Register';
import '../App.css';

class RegisterView extends React.Component {

  handleSubmit = e => {
    e.preventDefault();
    const { fetchRegister, history } = this.props;
    Promise.resolve(
      fetchRegister(
        e.target.username.value,
        e.target.password.value,
        e.target.displayname.value,
        this.image
      )
    ).then(() => {
      history.push('/login');
    });
  };

  handleChangeImage = e => {
    e.preventDefault();
    if (e.target.files[0]) {
     // eslint-disable-next-line prefer-destructuring
     this.image = e.target.files[0];
    }
  }

  render() {
    const { RegisterState } = this.props;
    const { error, pending } = RegisterState;

    return (
      <div
        style={{ height: '90vh', display: 'flex', justifyContent: 'center' }}
      >
        <Form
          style={{ width: '50%', alignSelf: 'center', textAlign: 'center' }}
          onSubmit={this.handleSubmit}
        >
          <Form.Label style={{ fontSize: '20px', width: '100%' }}>
            SIGN UP
          </Form.Label>

          <Form.Group
            controlId="formBasicDisplayname"
            style={{ textAlign: 'left' }}
          >
            <Form.Label>Display Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Em tập chơi"
              name="displayname"
            />
          </Form.Group>

          <Form.Group
            controlId="formBasicUsername"
            style={{ textAlign: 'left' }}
          >
            <Form.Label>Username</Form.Label>
            <Form.Control type="text" placeholder="sieusaoxo" name="username" />
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

          <Form.Group
            controlId="formBasicRetypePassword"
            style={{ textAlign: 'left' }}
          >
            <Form.Label>Retype Password</Form.Label>
            <Form.Control type="password" placeholder="******" />
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

          <Form.Group
            controlId="formAddAvatar"
            style={{ textAlign: 'left' }}
          >
            <Form.Label>Avatar</Form.Label>
            <Form.Control type="file" onChange={this.handleChangeImage} />
          </Form.Group>
          <Button variant="success" type="submit">
            Register
          </Button>
        </Form>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  RegisterState: state.RegisterReducer
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      fetchRegister: fetchRegisterAction
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(RegisterView));
