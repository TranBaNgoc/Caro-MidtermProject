import React from 'react';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';
import Spinner from 'react-bootstrap/Spinner';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import io from '../constants/SocketIO';
import '../App.css';
import { CreateRoom, SearchCompetitor, HadCompetitor } from '../actions/Home';

class Home extends React.Component {
  constructor(props) {
    super(props);
    const token = localStorage.getItem('token');
    const { GameState } = this.props;
    const { user } = GameState;
    if (token == null || user == null) {
      const { history } = this.props;
      history.push('/login');
    }

    io.on('isHaveCompetitor', isHave => {
      if (isHave) {
        this.setPendingSearch(isHave);
      }
    });
  }

  setPendingSearch = isHave => {
    if (isHave) {
      const { onHadCompetitor } = this.props;
      onHadCompetitor();
      this.createRoom(false);
    }
  };

  createPersonRoom = () => {
    io.emit('SearchCompetitor', null);
    const { onSearchCompetitor } = this.props;
    onSearchCompetitor();
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
    const { HomeState } = this.props;
    const { pending } = HomeState;

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
          {pending ? (
            <Spinner animation="border" role="status">
              <span className="sr-only">Loading...</span>
            </Spinner>
          ) : (
            ''
          )}
        </Button>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  GameState: state.Game,
  HomeState: state.HomeReducer
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      onCreateRoom: CreateRoom,
      onSearchCompetitor: SearchCompetitor,
      onHadCompetitor: HadCompetitor
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Home));
