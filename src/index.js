import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';

function Square( props ) {
  return (
      <button
        className={"square " + ( props.winningSquare ? 'winning-square' : '' )}
        onClick={props.onClick}>
        {props.value}
      </button>
  );
}

class Board extends React.Component {

  renderSquare( i ) {
    return (
    <Square
      value={this.props.squares[i]}
      winningSquare={this.props.winningSquares.includes( i )}
      key={"square" + i }
      onClick={() => this.props.onClick( i )}
    />
    );
  }

  render() {
    const allSquares = [];
    for ( var row = 0; row < 3; row++ ) {
      const rows = [];
      for ( var col = 0; col < 3; col++ ) {
        var squareNo = ( row * 3 ) + col;
        rows.push( this.renderSquare( squareNo ) );
      }
      allSquares.push( <div className="board-row" key={ "row-" + row}>{rows}</div>);
    }

    return (
      <div>
        {allSquares}
      </div>
    )
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        move: ''
      }],
      isDescending: true,
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick( i ) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[ history.length - 1 ];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        move: 'Col-' + ( Math.floor( i / 3 ) ) + '; Row-' + ( i % 3 ),
      }]),
      
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
    console.log( history );
  }

  jumpTo( step ) {
    this.setState({
      stepNumber: step,
      xIsNext: ( step % 2 ) === 0,
    })
  }

  sortHistory() {
    this.setState( {
      isDescending: !this.state.isDescending
    })
  }

  render() {
    const history = this.state.history;
    const current = history[ this.state.stepNumber ];
    const winner = calculateWinner( current.squares );

    const moves = history.map( ( step, move ) => {
      const desc = move ?
       'Go to move #' + move :
       'Go to game start';
      return (
        <li key={move}>
          <button
            onClick={() => this.jumpTo( move ) }
            style={{ fontWeight: move === this.state.stepNumber ? 'bold' : 'normal' }}
            >
            {desc}</button>
          <p>{step.move}</p>
        </li>
      )
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner.winner;
    } else {
      let draw = current.squares.some( square => !square );
      if ( draw ) {
        status = 'Nobody wins';
      } else {
        status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      }
      
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            winningSquares={winner && winner.winningSquares || []}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button onClick={() => this.sortHistory()}>
            Sort by: { this.state.isDescending ? "Descending" : "Ascending" }
          </button>
          <ol>{ this.state.isDescending ? moves : moves.reverse() }</ol>
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
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        winner: squares[a],
        winningSquares: lines[ i ]
      }
    }
  }
  return null;
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
