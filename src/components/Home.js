import React from 'react';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import '../App.css';
import CreateRoom from '../actions/Home';

class LoginView extends React.Component {
  constructor(props) {
    super(props);
    const token = localStorage.getItem('token');
    const { GameState } = this.props;
    const { user } = GameState;
    if (token == null || user == null) {
      const { history } = this.props;
      history.push('/login');
    }
  }

  createPersonRoom = () => {
    this.createRoom(false);
  };

  createBotRoom = () => {
    this.createRoom(true);
  };

  createRoom = playWithBot => {
    const { history, onCreateRoom } = this.props;
    onCreateRoom(playWithBot);
    history.push('/game');
  };

  render() {
    return (
      <div style={{ textAlignLast: 'center', marginTop: '10%' }}>
        <Button
          style={{ width: '300px', height: '300px', marginRight: '2px' }}
          variant="outline-primary"
          onClick={this.createBotRoom}
        >
          <div style={{ marginBottom: '10px' }}>
            <Image width="60%" src="bot.png" roundedCircle />
          </div>
          Against the BOT
        </Button>

        <Button
          style={{ width: '300px', height: '300px' }}
          variant="outline-primary"
          onClick={this.createPersonRoom}
        >
          <div
            style={{
              marginBottom: '10px',
              transform: 'perspective(300px) rotateX(0deg) rotateY(0deg)',
              willChange: 'transform'
            }}
          >
            <Image width="60%" src="user.png" roundedCircle />
          </div>
          Play with another
        </Button>
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
      onCreateRoom: CreateRoom
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(LoginView));
