import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button 
      className="square" 
      onClick={props.onClick}
    >
      { props.value }
    </button>
  );
}
  
  class Board extends React.Component {
    renderSquare(i, j) {
      return (
        <Square 
          value={ this.props.squares[i][j] } 
          onClick={() => this.props.onClick(i, j)}
        />
      );
    }
  
    render() {
      const rows = [];
      const template = (<div> {rows} </div>);

      for (let i = 0; i < this.props.squares.length; i++) {
        const columns = [];
        rows.push(<div className="board-row"> {columns} </div>);
      
        for (let j = 0; j < this.props.squares[i].length; j++) {
          columns.push(this.renderSquare(i, j));
        }
      }      
      return template;
    }
  }
  
  class Game extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        history: [{
          squares: [
            [null, null, null], 
            [null, null, null], 
            [null, null, null],
          ],
          location: [] // [i, j]
        }],
        stepNumber: 0,
        xIsNext: true,
      };
    }

    
    handleClick(i, j) {
      const history = this.state.history.slice(0, this.state.stepNumber + 1);
      const current = history[history.length - 1];
      const squares = current.squares.map(row => row.slice());
      if (calculateWinner(squares) || squares[i][j]) {
        return;
      }

      squares[i][j] = this.state.xIsNext ? 'X' : 'O';
      this.setState({
        history: history.concat([{
          squares: squares,
          location: [i, j]
        }]),
        stepNumber: history.length,
        xIsNext: !this.state.xIsNext,
      })
    } 

    jumpTo(step) {
      this.setState({
        stepNumber: step,
        xIsNext: (step % 2) === 0,
      })
    }

    render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const winner = calculateWinner(current.squares);

      const moves = history.map((step, move) => {
        const desc = move ?
          `Go to move #${move} (${step.location.join(",")})` :
          'Go to game start';
        return (
          <li key={move}>
            <button onClick={() => this.jumpTo(move)}>{desc}</button>
          </li>
        );
      });

      let status;
      if (winner) {
        status = 'Winner: ' + winner;
      } else {
        status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      }

      return (
        <div className="game">
          <div className="game-board">
            <Board 
              squares={current.squares}
              onClick={(i, j) => this.handleClick(i, j) }
            />
          </div>
          <div className="game-info">
            <div>{ status }</div>
            <ol>{moves}</ol>
          </div>
        </div>
      );
    }
  }
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );

  function calculateWinner(squares) {
    const lines = [
      [[0, 0], [0, 1], [0, 2]],
      [[1, 0], [1, 1], [1, 2]],
      [[2, 0], [2, 1], [2, 2]],

      [[0, 0], [1, 0], [2, 0]],
      [[0, 1], [1, 1], [2, 1]],
      [[0, 2], [1, 2], [2, 2]],
      
      [[0, 0], [1, 1], [2, 2]],
      [[0, 2], [1, 1], [2, 0]],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [[a_i, a_j], [b_i, b_j], [c_i, c_j]] = lines[i];
      if (squares[a_i][a_j] && squares[a_i][a_j] === squares[b_i][b_j] && squares[a_i][a_j] === squares[c_i][c_j]) {
        return squares[a_i][a_j];
      }
    }
    return null;
  }
  