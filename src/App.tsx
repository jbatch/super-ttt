/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react';
import './App.css';
import { cn } from './utils';

type Player = 1 | 2;
type Board = number[];
type Move = [number, number];

function validMove(move: Move, lastMove: Move | undefined, board: Board[]) {
  // If no moves have been played you can go anywhere
  if (lastMove === undefined) {
    return true;
  }
  // Can't play in a spot that's already been played in
  if (board[move[0]][move[1]] !== 0) {
    console.log(`Can't play in a spot that's already been played in`);
    return false;
  }
  // Can't play a move on a board that has been won
  if (getWinner(board, move[0]) !== 0) {
    console.log(`Can't play a move on a board that has been won`);
    return false;
  }
  // If the last board played on has been won you can play anywhere
  if (getWinner(board, lastMove[1]) !== 0) {
    return true;
  }

  if (move[0] !== lastMove[1]) {
    console.log('Move must be in bobard: ', lastMove[1]);
    return false;
  }
  return true;
}

function getWinner(board: Board[], boardNumber: number) {
  return getWinnerForBoard(board[boardNumber]);
}

function getWinnerForBoard(board: Board): number {
  // 0 | 1 | 2
  // 3 | 4 | 5
  // 6 | 7 | 8
  const winningLines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  const hasWinningLine = (player: number) =>
    winningLines.some(
      ([a, b, c]) =>
        board[a] == player && board[b] == player && board[c] === player
    );
  const p1Win = hasWinningLine(1);
  if (p1Win) {
    return 1;
  }

  const p2Win = hasWinningLine(2);
  if (p2Win) {
    return 2;
  }
  if (board.every((n) => n !== 0)) {
    return 3; // draw
  }
  return 0;
}

function App() {
  const EMPTY_BOARD = [...Array(9)].map(() => [...Array(9)].map(() => 0));
  // const TEST =
  //   JSON.parse(`[[0,0,0,0,2,0,2,0,0],[0,0,2,0,0,0,0,0,0],[0,0,1,0,1,2,1,0,0],[0,0,0,2,1,0,0,0,0],[1,0,0,0,1,0,0,2,1],[0,0,2,0,0,1,0,0,0],[0,0,0,0,1,0,2,0,1],[0,0,0,0,0,0,0,0,1],[0,0,2,0,2,0,2,0,0]]
  // `);
  const [boards, setBoards] = useState<Board[]>(EMPTY_BOARD);
  const [currPlayer, setCurrPlayer] = useState<Player>(1);
  const [lastMove, setLastMove] = useState<Move | undefined>(undefined);
  const [gameOver, setGameOver] = useState(false);

  // const log = () => {
  //   console.log(JSON.stringify(boards));
  //   const o = boards.map((_, i) => getWinner(boards, i));
  //   console.log(o);
  //   console.log(getWinnerForBoard(o));
  // };

  const handleClick = (move: Move) => {
    if (gameOver || !validMove(move, lastMove, boards)) {
      console.log('invalid move');
      return;
    }
    const updatedBoards = JSON.parse(JSON.stringify(boards)) as Board[];
    updatedBoards[move[0]][move[1]] = currPlayer;
    setBoards(updatedBoards);
    setCurrPlayer((v) => (v === 1 ? 2 : 1));
    setLastMove(move);

    const outerBoard = updatedBoards.map((_, i) => getWinner(updatedBoards, i));
    const winner = getWinnerForBoard(outerBoard);
    if (winner !== 0) {
      setGameOver(true);
      console.log('winner: ', winner);
    }
  };

  const reset = () => {
    setBoards(EMPTY_BOARD);
    setCurrPlayer(1);
    setLastMove(undefined);
    setGameOver(false);
  };
  const bgColorForPlayer = (player: number) => {
    switch (player) {
      case 1:
        return 'bg-sky-600';
      case 2:
        return 'bg-red-600';
      case 3:
        return 'bg-amber-300';
    }
    return '';
  };
  const symbolForPlayer = (player: number) => {
    switch (player) {
      case 1:
        return 'X';
      case 2:
        return '0';
      case 3:
        return '-';
    }
    return '';
  };
  const outerBoardClass = (player: number) => {
    switch (player) {
      case 1:
        return 'border-8 border-sky-600 bg-sky-600';
      case 2:
        return 'border-8 border-red-600 bg-red-600';
      case 3:
        return 'border-8 border-amber-300 bg-amber-300';
    }
    return '';
  };

  return (
    <div className='flex flex-col items-center justify-center'>
      <p className='text-2xl'>Super Tic Tac Toe</p>
      <div className='p-4 w-full lg:w-1/2 grid grid-cols-3 grid-rows-3 aspect-square'>
        {boards.map((innerBoard, outer) => {
          const winner = getWinnerForBoard(boards[outer]);
          return (
            <div
              key={`o${outer}`}
              className={cn(
                'border-solid border-2 border-slate-500 p-1 grid grid-cols-3 grid-rows-3 aspect-square',
                outerBoardClass(winner)
              )}
            >
              {innerBoard.map((a, inner) => {
                return (
                  <div
                    key={`i${inner}`}
                    className={cn(
                      'border-solid border-2 border-sky-200 flex justify-center items-center hover:cursor-pointer hover:bg-teal-200',
                      bgColorForPlayer(a)
                    )}
                    onClick={() => handleClick([outer, inner])}
                  >
                    {symbolForPlayer(a)}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
      <button className='w-full md:w-1/2' onClick={() => reset()}>
        Reset
      </button>
    </div>
  );
}

export default App;
