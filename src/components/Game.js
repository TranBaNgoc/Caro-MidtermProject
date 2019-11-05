import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import FormControl from 'react-bootstrap/FormControl';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import swal from 'sweetalert';

import io from '../constants/SocketIO';
import '../App.css';
import Board from './Board';
import * as action from '../actions/Game';
import Message from './Message';

const localStorage = require('localStorage');

const MaxHeight = 20;
const MaxWidth = 20;
let value = -1;
let backupvalue = -1;
let colorsArray = Array(400).fill('#dbbc8c');

class Game extends React.Component {
  constructor(props) {
    super(props);
    const token = localStorage.getItem('token');
    let { GameState } = this.props;
    const { user, playWithBot } = GameState;

    // constructor global
    colorsArray = Array(400).fill('#dbbc8c');
    value = -1;
    // End constructor of global

    if (token == null || user == null) {
      const { history } = this.props;
      history.push('/login');
    } else {
      if (!playWithBot) {
        io.on('BroadcastMessage', data => {
          this.addMessage(data);
        });

        io.on('BroadcastStep', positionData => {
          if (positionData.user.username === user.username) {
            this.isYouNext = false;
          } else {
            this.isYouNext = true;
          }
          this.handleClick(positionData.position);
        });

        io.on('RequestResetGame', username => {
          swal({
            title: 'Are you sure?',
            text: `Do you want to play new game${
              username === user.username ? '' : `with ${username}?`
            }`,
            icon: 'warning',
            buttons: true,
            dangerMode: true
          }).then(willDelete => {
            if (willDelete) {
              this.resetGame();
            } else {
              const { history } = this.props;
              history.push('/');
            }
          });
        });

        io.on('BroadcastUndo', username => {
          if (user.username !== username) {
            swal({
              title: 'Are you sure?',
              text: `${username} want to Undo. Do you agree?}`,
              icon: 'warning',
              buttons: true,
              dangerMode: true
            }).then(willDelete => {
              if (willDelete) {
                io.emit('AcceptUndo', true);
              } else {
                const messageData = {
                  message: 'Mình không đồng ý đi lại.',
                  user: user.username,
                  avatar: localStorage.getItem('avatar')
                };
                io.emit('AddMessage', messageData);
                io.emit('AcceptUndo', false);
              }
            });
          }
        });

        io.on('BroadcaseAcceptUndo', isAccept => {
          if (isAccept) {
            this.onUndo();
          }
        });

        io.on('BroadcastDraw', username => {
          if (user.username !== username) {
            swal({
              title: 'Are you sure?',
              text: `${username} want to be draw. Do you agree?}`,
              icon: 'warning',
              buttons: true,
              dangerMode: true
            }).then(willDelete => {
              if (willDelete) {
                io.emit('AcceptDraw', true);
              } else {
                const messageData = {
                  message: 'Mình không đồng ý hoà.',
                  user: user.username,
                  avatar: localStorage.getItem('avatar')
                };
                io.emit('AddMessage', messageData);
                io.emit('AcceptDraw', false);
              }
            });
          }
        }) 

        io.on('BroadcastAcceptDraw', isAccept => {
          if (isAccept) {
            this.resetGame();
            this.isYouNext = true;
          } 
        })
      }
      this.isYouNext = true;
    }
  }

  // Máy đánh
  componentDidUpdate() {
    const { GameState } = this.props;
    const { xIsNext, playWithBot, history, stepNumber, winner } = GameState;
    if (playWithBot) {
      const histories = history.slice(0, stepNumber + 1);
      const current = histories[histories.length - 1];
      const squares = current.squares.slice();
      if (xIsNext) return;

      let i = Math.floor(Math.random() * 400);
      while (squares[i] !== null) {
        i = Math.floor(Math.random() * 400);
      }

      if (winner === null && value !== -1) {
        this.handleClick(i);
      }
    } else {
      const objDiv = document.getElementById('message-body');
      objDiv.scrollTop = objDiv.scrollHeight;
    }
  }

  onUndo = () => {
    const { GameState } = this.props;
    const { stepNumber } = GameState;
    this.jumpTo(stepNumber - 1);
    this.isYouNext = !this.isYouNext;
  };

  // Nhắn tin
  addMessage = messageData => {
    const { GameState, onAddMessage } = this.props;
    const { messages, user } = GameState;

    if (user != null) {
      messages.push(
        <Message
          content={messageData.message}
          isOwn={user.username === messageData.user}
          avatar={messageData.avatar}
        />
      );
      onAddMessage(messages);
    }
  };

  sendMessage = e => {
    const messageText = e.target.messageText.value;
    e.target.messageText.value = '';
    e.preventDefault();

    if (messageText === '') return;

    const { GameState } = this.props;
    const { user, playWithBot } = GameState;

    // Start socket client
    const messageData = {
      message: messageText,
      user: user.username,
      avatar: localStorage.getItem('avatar')
    };

    if (!playWithBot) {
      io.emit('AddMessage', messageData);
    }
    // End socket client
  };

  isBlock2Ends = (squares, type, competitor) => {
    const row = Math.floor(value / 20);
    const column = value % 20;
    let hasCompetitor = false;

    switch (type) {
      // Chặn 2 đầu ngang
      case 'horizontal':
        for (let i = column - 1; i >= 0; i -= 1) {
          if (squares[row * MaxWidth + i] === competitor) {
            hasCompetitor = true;
            break;
          }
        }

        if (hasCompetitor) {
          for (let i = column + 1; i < MaxWidth; i += 1) {
            if (squares[row * MaxWidth + i] === competitor) {
              return true;
            }
          }
        } else {
          return false;
        }

        break;

      // Chặn 2 đầu dọc
      case 'vertical':
        for (let i = row - 1; i >= 0; i -= 1) {
          if (squares[i * MaxWidth + column] === competitor) {
            hasCompetitor = true;
            break;
          }
        }

        if (hasCompetitor) {
          for (let i = row + 1; i < MaxHeight; i += 1) {
            if (squares[i * MaxWidth + column] === competitor) {
              return true;
            }
          }
        } else {
          return false;
        }

        break;

      // Chặn 2 đầu chéo "/"
      case 'slash':
        for (let i = 1; row + i < MaxHeight - 1 && column - i >= 0; i += 1) {
          if (squares[(row + i) * MaxWidth + column - i] === competitor) {
            hasCompetitor = true;
            break;
          }
        }

        if (hasCompetitor) {
          for (let i = 1; row - i >= 0 && column + i < MaxWidth; i += 1) {
            if (squares[(row - i) * MaxWidth + column + i] === competitor) {
              return true;
            }
          }
        } else {
          return false;
        }
        break;

      // Chặn 2 đầu chéo "\"
      case 'backslash':
        for (let i = 1; row - i >= 0 && column - i >= 0; i += 1) {
          if (squares[(row - i) * MaxWidth + column - i] === competitor) {
            hasCompetitor = true;
            break;
          }
        }

        if (hasCompetitor) {
          for (
            let i = 1;
            row + i < MaxHeight && column + i < MaxWidth;
            i += 1
          ) {
            if (squares[(row + i) * MaxWidth + column + i] === competitor) {
              return true;
            }
          }
        } else {
          return false;
        }
        break;
      default:
        break;
    }

    return false;
  };

  jumpTo = step => {
    const { GameState, onJumpToStep } = this.props;
    const { history, playWithBot } = GameState;

    if (step !== history.length - 1) {
      value = -1;
      colorsArray = Array(400).fill('#dbbc8c');
      onJumpToStep(step, false);
    } else {
      value = backupvalue;
      onJumpToStep(step, true);
    }

    if (playWithBot) {
      for (let i = 0; i < history.length; i += 1) {
        if (i === step) {
          document.getElementById(i).style.background = '#0c4517';
        } else document.getElementById(i).style.background = '#4CAF50';
      }
    }
  };

  paintWinLine = winLine => {
    colorsArray = Array(400).fill('#dbbc8c');
    for (let count = 0; count < 5; count += 1) {
      colorsArray[winLine[count]] = '#2aed18';
    }
  };

  addStep = position => {
    if (!this.isYouNext) return;

    const { GameState } = this.props;
    const { history, stepNumber, user, playWithBot, winner } = GameState;
    const histories = history.slice(0, stepNumber + 1);
    const current = histories[histories.length - 1];
    const squares = current.squares.slice();

    // Nếu ô đó đã có người đánh rồi hoặc game đã kết thúc thì dừng hàm
    if (winner || squares[position]) {
      return;
    }

    if (!playWithBot) {
      io.emit('AddStep', { user, position });
      io.emit('AddMessage', {
        message: `I have just tick at (${Math.floor(position / 20) +
          1}:${(position % 20) + 1})`,
        user: user.username,
        avatar: localStorage.getItem('avatar')
      });
    } else {
      for (let j = 0; j < histories.length; j += 1) {
        document.getElementById(j).style.background = '#4CAF50';
      }
      this.handleClick(position);
    }
  };

  handleRequestUndo = e => {
    e.preventDefault();
    const { GameState } = this.props;
    const { user } = GameState;
    io.emit('RequestUndo', user.username);
  };

  handleRequestDraw = e => {
    e.preventDefault();
    const { GameState } = this.props;
    const { user } = GameState;
    io.emit('RequestDraw', user.username);
  };

  handleRequestSurrender = e => {
    e.preventDefault();
  };

  calculateWinner(squares) {
    if (value === -1) {
      return null;
    }

    const row = Math.floor(value / 20);
    const column = value % 20;

    const thisValue = squares[row * 20 + column];
    // console.log(squares);
    let winLine = Array(5).fill(null);
    // // Kiểm tra hàng dọc chứa điểm vừa đánh
    for (let index = row - 4; index <= row; index += 1) {
      winLine = Array(5).fill(null);
      // Nếu ô row + index (Ô đầu tiên của dãy 5) nằm ngoài bàn cờ
      if (index < 0) {
        // continue;
      }

      // Trường hợp đủ 5 con trong bàn cờ
      let isWon = true;

      for (let i = index; i < index + 5; i += 1) {
        winLine[i - index] = i * MaxWidth + column;
        // console.log(squares[i * MaxWidth + column])
        if (i > MaxHeight - 1) {
          isWon = false;
          break;
        }

        if (squares[i * MaxWidth + column] !== thisValue) {
          isWon = false;
          break;
        }
      }

      if (
        isWon === true &&
        !this.isBlock2Ends(squares, 'vertical', thisValue === 'X' ? 'O' : 'X')
      ) {
        this.paintWinLine(winLine);
        return thisValue;
      }
    }

    // // Kiểm tra hàng ngang chứa điểm vừa đánh
    for (let index = column - 4; index <= column; index += 1) {
      winLine = Array(5).fill(null);
      if (index < 0) {
        break;
      }

      // Nếu ô column + index (Ô đầu tiên của dãy 5) nằm ngoài bàn cờ
      if (index < 0) {
        // continue;
      }

      // Trường hợp đủ 5 con trong bàn cờ
      let isWon = true;
      for (let i = index; i < index + 5; i += 1) {
        winLine[i - index] = row * MaxWidth + i;
        if (i > MaxWidth - 1) {
          isWon = false;
          break;
        }
        if (squares[row * MaxWidth + i] !== thisValue) {
          isWon = false;
          break;
        }
      }

      if (
        isWon === true &&
        !this.isBlock2Ends(squares, 'horizontal', thisValue === 'X' ? 'O' : 'X')
      ) {
        this.paintWinLine(winLine);
        return thisValue;
      }
    }

    // // Kiểm tra hàng chéo từ trái qua, trên xuống chứa điểm vừa đánh

    for (let index = -4; index <= 0; index += 1) {
      winLine = Array(5).fill(null);

      // Nếu ô column + index (Ô đầu tiên của dãy 5) nằm ngoài bàn cờ
      if (index + column < 0 || index + row < 0) {
        // continue;
      }

      // Trường hợp đủ 5 con trong bàn cờ
      let isWon = true;
      for (let i = index; i < index + 5; i += 1) {
        winLine[i - index] = (row + i) * MaxWidth + (column + i);
        if (i + column > MaxWidth - 1 || i + row > MaxHeight - 1) {
          isWon = false;
          break;
        }

        if (squares[(row + i) * MaxWidth + (column + i)] !== thisValue) {
          isWon = false;
          break;
        }
      }

      if (
        isWon === true &&
        !this.isBlock2Ends(squares, 'backslash', thisValue === 'X' ? 'O' : 'X')
      ) {
        this.paintWinLine(winLine);
        return thisValue;
      }
    }

    // // Kiểm tra hàng chéo từ trái qua, dưới lên chứa điểm vừa đánh

    for (let index = -4; index <= 0; index += 1) {
      winLine = Array(5).fill(null);

      // Nếu ô column + index (Ô đầu tiên của dãy 5) nằm ngoài bàn cờ
      if (index + column < 0 || row - index > MaxHeight - 1) {
        // continue;
      }

      // Trường hợp đủ 5 con trong bàn cờ
      let isWon = true;
      for (let i = index; i < index + 5; i += 1) {
        winLine[i - index] = (row - i) * MaxWidth + (column + i);
        if (i + column > MaxWidth - 1 || row - i < 0) {
          isWon = false;
          break;
        }

        if (squares[(row - i) * MaxWidth + (column + i)] !== thisValue) {
          isWon = false;
          break;
        }
      }

      if (
        isWon === true &&
        !this.isBlock2Ends(squares, 'slash', thisValue === 'X' ? 'O' : 'X')
      ) {
        this.paintWinLine(winLine);
        return thisValue;
      }
    }

    return null;
  }

  handleClickSort() {
    const { onSortHistory } = this.props;
    onSortHistory();
  }

  resetGame() {
    colorsArray = Array(400).fill('#dbbc8c');
    const { onResetGame } = this.props;
    value = -1;
    onResetGame();
  }

  handleClickReset() {
    const { GameState } = this.props;
    const { user, playWithBot } = GameState;
    if (playWithBot) {
      this.resetGame();
    } else {
      io.emit('ResetGame', user.username);
    }
  }

  handleClick(i) {
    const { GameState } = this.props;
    const { history, stepNumber, xIsNext, winner } = GameState;
    const histories = history.slice(0, stepNumber + 1);
    const current = histories[histories.length - 1];
    const squares = current.squares.slice();

    // Nếu ô đó đã có người đánh rồi hoặc game đã kết thúc thì dừng hàm
    if (winner || squares[i]) {
      return;
    }

    value = i;
    backupvalue = value;
    squares[i] = xIsNext ? 'X' : 'O';

    const { onAddStep } = this.props;
    onAddStep(
      histories.concat([
        {
          squares,
          position: value
        }
      ]),
      histories.length,
      !xIsNext
    );

    const win = this.calculateWinner(squares);
    if (win !== null) {
      const { onAddWinner } = this.props;
      onAddWinner(win);
    }
  }

  render() {
    const { GameState } = this.props;
    const {
      history,
      stepNumber,
      messages,
      playWithBot,
      isIncrease
    } = GameState;
    const current = history[stepNumber];

    const Style = {
      margin: '5px',
      background: '#4CAF50' /* Green */,
      border: 'none',
      color: 'white',
      padding: '0px',
      width: '200px',
      height: '40px',
      fontSize: '14px'
    };

    const moves = [];
    if (isIncrease) {
      for (let i = 0; i < history.length; i += 1) {
        const desc = i
          ? `Đi lại bước ${i}: [${Math.floor(
              history[i].position / MaxWidth
            )};${history[i].position % MaxWidth}]`
          : 'Đi lại từ đầu';

        moves.push(
          <li key={i} style={{ textDecoration: 'none' }}>
            <button
              type="button"
              style={Style}
              onClick={() => this.jumpTo(i)}
              id={i}
            >
              {desc}
            </button>
          </li>
        );
      }
    } else {
      for (let i = history.length - 1; i >= 0; i -= 1) {
        const desc = i
          ? `Đi lại bước ${i}: [${Math.floor(
              history[i].position / MaxWidth
            )};${history[i].position % MaxWidth}]`
          : 'Đi lại từ đầu';

        moves.push(
          <li key={i} style={{ textDecoration: 'none' }}>
            <button
              type="button"
              style={Style}
              onClick={() => this.jumpTo(i)}
              id={i}
            >
              {desc}
            </button>
          </li>
        );
      }
    }

    const sourceImgSort = isIncrease
      ? 'https://imgur.com/6l1wdoQ.png'
      : 'https://imgur.com/y0uioJc.png';

    return (
      <div className="App">
        <header className="App-header">
          <div className="game">
            <div className="status" style={{ width: '115px' }}>
              <button
                type="button"
                onClick={() => this.handleClickReset()}
                style={{ border: 'none', background: 'transparent' }}
              >
                <img src="https://i.imgur.com/n2W67wf.png" alt="Chơi lại" />
              </button>

              {playWithBot ? (
                ''
              ) : (
                <div>
                  <button
                    type="button"
                    className="myButton"
                    onClick={this.handleRequestUndo}
                  >
                    Undo
                  </button>
                  <button
                    type="button"
                    className="myButton"
                    onClick={this.handleRequestDraw}
                  >
                    Draw
                  </button>
                  <button
                    type="button"
                    className="myButton"
                    onClick={this.handleRequestSurrender}
                  >
                    Surrender
                  </button>
                </div>
              )}
            </div>
            <div className="game-board" style={{ width: '100%' }}>
              <Board
                squares={current.squares}
                colors={colorsArray}
                onClick={i => this.addStep(i)}
              />
            </div>

            {playWithBot ? (
              <div
                style={{
                  marginLeft: '15px',
                  width: '100%'
                }}
                className="game-info"
              >
                <button
                  type="button"
                  onClick={() => this.handleClickSort()}
                  style={{ border: 'none', background: 'transparent' }}
                >
                  <img
                    src={sourceImgSort}
                    alt="Sắp xếp danh sách"
                    style={{ width: '40px', height: '40px', float: 'right' }}
                  />
                </button>

                <div
                  style={{
                    overflowX: 'hidden',
                    overflowY: 'auto',
                    height: '85vh'
                  }}
                >
                  <ul style={{ marginTop: '0px' }}>{moves}</ul>
                </div>
              </div>
            ) : (
              <div className="messenger" style={{ color: 'black' }}>
                <div className="message-header">CHAT BOX</div>
                <hr style={{ marginTop: '30px' }} />

                <div className="message-body" id="message-body">
                  {messages}
                </div>

                <Form onSubmit={this.sendMessage} autoComplete="off">
                  <InputGroup
                    className="mb-3 message-input"
                    style={{ padding: '0px', margin: '0px' }}
                  >
                    <FormControl
                      style={{ padding: '0px' }}
                      aria-label="Recipient's username"
                      aria-describedby="basic-addon2"
                      name="messageText"
                    />
                    <InputGroup.Append>
                      <Button variant="success" type="submit">
                        Send
                      </Button>
                    </InputGroup.Append>
                  </InputGroup>
                </Form>
              </div>
            )}
          </div>
        </header>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  GameState: state.Game
});

const mapDispatchToProps = dispatch => {
  return {
    onAddStep: (history, stepNumber, xIsNext) => {
      dispatch(action.AddStep(history, stepNumber, xIsNext));
    },
    onResetGame: () => {
      dispatch(action.ResetGame());
    },
    onSortHistory: () => {
      dispatch(action.Sort());
    },
    onJumpToStep: (stepNumber, isEnd) => {
      dispatch(action.JumpToStep(stepNumber, isEnd));
    },
    onAddMessage: messages => {
      dispatch(action.AddMessage(messages));
    },
    onAddWinner: winner => {
      dispatch(action.AddWinner(winner));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Game));
