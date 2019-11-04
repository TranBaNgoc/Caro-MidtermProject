import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Spinner from 'react-bootstrap/Spinner';
import Image from 'react-bootstrap/Image';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import {
  fetchGetProfile,
  fetchPostUpdateProfile
} from '../actions/UpdateProfile';
import '../App.css';

const ls = require('localStorage');

class UpdateProfileView extends React.Component {
  constructor(props) {
    super(props);

    if (ls.getItem('token')) {
      const { fetchGet } = this.props;
      Promise.resolve(fetchGet());
    } else {
      const { history } = this.props;
      history.push('/login');
    }
  }

  handleSubmit = e => {
    e.preventDefault();
    const { fetchUpdate } = this.props;
    Promise.resolve(
      fetchUpdate(
        e.target.username.value,
        e.target.password.value,
        e.target.displayname.value
      )
    );
  };

  render() {
    const { UpdateState } = this.props;
    const { error, pending } = UpdateState;
    return (
      <div
        style={{ height: '90vh', display: 'flex', justifyContent: 'center' }}
      >
        <Form
          style={{ width: '50%', alignSelf: 'center', textAlign: 'center' }}
          onSubmit={this.handleSubmit}
        >
          <Form.Label style={{ fontSize: '20px', width: '100%' }}>
            UPDATE PROFILE
          </Form.Label>

          <Form.Group
            controlId="formBasicUsername"
            style={{ textAlign: 'left' }}
          >
            <Form.Label>Username</Form.Label>
            <Form.Control
              value={UpdateState.username}
              type="text"
              placeholder="sieusaoxo"
              name="username"
            />
          </Form.Group>

          <Form.Group
            controlId="formBasicDisplayname"
            style={{ textAlign: 'left' }}
          >
            <Form.Label>Display Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Em tập chơi"
              name="displayname"
              defaultValue={UpdateState.displayname}
            />
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
              defaultValue={UpdateState.password}
            />
          </Form.Group>

          <Form.Group
            controlId="formBasicRetypePassword"
            style={{ textAlign: 'left' }}
          >
            <Form.Label>Retype Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="******"
              defaultValue={UpdateState.password}
            />
          </Form.Group>

          <Form.Group>
            <Image width="15%" src={UpdateState.avatar} roundedCircle />
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

          <Button variant="success" type="submit">
            Update
          </Button>
        </Form>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  UpdateState: state.UpdateProfileReducer,
  GameState: state.Game
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      fetchUpdate: fetchPostUpdateProfile,
      fetchGet: fetchGetProfile
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(UpdateProfileView));
