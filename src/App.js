import {useState} from 'react';

function Square({value, onSquareClick, isWinnerSquare}) {
    if (isWinnerSquare === true) {
        return (
            <button className="winnerSquare" onClick={onSquareClick} >
                {value}
            </button>
        );
    }
    return (
        <button className="square" onClick={onSquareClick}>
            {value}
        </button>
    );
}

function Board({xIsNext, squares, onPlay, currentMoveNumber, reverseToggle, onToggleReverse}) {

    let currentMove = "You are at move #" + currentMoveNumber;
    function handleClick(i){
        if(calculateWinner(squares) || squares[i]){
            return;
        }

        const nextSquares = squares.slice();
        if(xIsNext){
            nextSquares[i] = "X";
        }
        else {
            nextSquares[i] = "O";
        }
        onPlay(nextSquares);
    }

    const winner = calculateWinner(squares);
    let status;
    if(winner){
        status = "Winner: " + (xIsNext ? 'X' : 'O');
    }
    else {
        status = "Next Player: " + (xIsNext ? 'X' : 'O');
    }

    const boardArray = [];
    for(let i = 0; i < 9; ++i){
        if(winner && (winner.includes(i) ) ){
            boardArray.push(
                <Square value={squares[i]} onSquareClick={() => handleClick(i)}  isWinnerSquare={true}/>
            )
        }
        else {
            boardArray.push(
                <Square value={squares[i]} onSquareClick={() => handleClick(i)}  isWinnerSquare={false}/>
            )
        }
    }

    return (
        <>
            <div className="status">{status}, {currentMove}</div>
            <div className="board-row">
                {boardArray.slice(0, 3)}
            </div>
            <div className="board-row">
                {boardArray.slice(3, 6)}
            </div>
            <div className="board-row">
                {boardArray.slice(6, 9)}
            </div>
            <button type="button" onClick={onToggleReverse}>Reverse Move List</button>
        </>
    );
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    for (let i = 0 ; i < lines.length ; ++i) {
        const [a, b,c] = lines[i];
        if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]){
            return lines[i];
        }
    }
    return null;
}

export default function Game() {
    const [history, setHistory] = useState([Array(9).fill(null)]);
    const [currentMove, setCurrentMove] = useState(0);
    const xIsNext = currentMove % 2 === 0;
    const currentSquares = history[currentMove];
    const [reverseToggle, setReverseToggle] = useState(false);



    function handlePlay(nextSquares){
        const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
        setHistory(nextHistory);
        setCurrentMove(nextHistory.length - 1);
    }

    function jumpTo(nextMove) {
        setCurrentMove(nextMove);
    }

    function DisplayMiniBoard({squares}) {
        const squaresArray = Array.from(squares);
        return (
            <div className="game">
                <div className="game-board">
                    <div className="mini-row">
                        {squaresArray.slice(0, 3).map((v, i) => (
                            <button key={i} className="mini-square" disabled>
                                {v}
                            </button>
                        ))}
                    </div>
                    <div className="mini-row">
                        {squaresArray.slice(3, 6).map((v, i) => (
                            <button key={i + 3} className="mini-square" disabled>
                                {v}
                            </button>
                        ))}
                    </div>
                    <div className="mini-row">
                        {squaresArray.slice(6, 9).map((v, i) => (
                            <button key={i + 6} className="mini-square" disabled>
                                {v}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
    const moves = history.map((squares, move) => {
        const description = move > 0 ? `Go to move #${move}` : 'Go to game start';
        return { move, description, squares };
    });

    const orderedMoves = reverseToggle ? [...moves].reverse() : moves;

    const moveList = orderedMoves.map(({ move, description, squares }) => (
        <>
            <li key={move}>
                <button onClick={() => jumpTo(move)}>{description}</button>
                <DisplayMiniBoard squares={squares} />
            </li>
        </>
    ));

    return (
        <div className="game">
            <div className="game-board">
                <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} currentMoveNumber={currentMove} reverseToggle={reverseToggle}
                       onToggleReverse={() => setReverseToggle(prev => !prev)}/>
            </div>
            <div className="game-info">
                <ol>{moveList}</ol>
            </div>
        </div>
    );
}