import { useState, useEffect } from 'react';
import Cell from './Cell';
import GameControls from '../controllers/GameControlls';
import CongratulationsMessage from '../controllers/SolvedGame';
import Timer from './Timer';

type CellValue = number | null;
type BoardState = CellValue[][];

export enum Difficulty {
  Easy = 0,
  Medium = 1,
  Hard = 2,
}
function formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

function generateBoard(): BoardState {
  const board: BoardState = Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => null));

  function backtrack(row: number, col: number): boolean {
    if (row === 9) {
      return true;
    }

    const nextRow = col === 8 ? row + 1 : row;
    const nextCol = col === 8 ? 0 : col + 1;

    if (board[row][col] !== null) {
      return backtrack(nextRow, nextCol);
    }

    const candidates = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);

    for (const candidate of candidates) {
      if (isValidMove(board, row, col, candidate)) {
        board[row][col] = candidate;
        if (backtrack(nextRow, nextCol)) {
          return true;
        }
        board[row][col] = null;
      }
    }

    return false;
  }

  backtrack(0, 0);

  return board;
}

function isValidMove(board: BoardState, row: number, col: number, value: number): boolean {
  for (let i = 0; i < 9; i++) {
    if (board[row][i] === value || board[i][col] === value) {
      return false;
    }
  }

  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;

  for (let i = boxRow; i < boxRow + 3; i++) {
    for (let j = boxCol; j < boxCol + 3; j++) {
      if (board[i][j] === value) {
        return false;
      }
    }
  }

  return true;
}

function shuffle<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function generatePuzzle(difficulty: Difficulty): BoardState {
  const solution = generateBoard();
  const puzzle = cloneBoard(solution);

  const cells = shuffle(
    Array.from({ length: 81 }, (_, index) => [Math.floor(index / 9), index % 9]) // Generate an array of all cell coordinates
  );

  let numCellsToRemove: number;

  switch (difficulty) {
    case Difficulty.Easy:
      numCellsToRemove = 40;
      break;
    case Difficulty.Medium:
      numCellsToRemove = 50;
      break;
    case Difficulty.Hard:
      numCellsToRemove = 60;
      break;
    default:
      numCellsToRemove = 50;
  }

  let numCellsRemoved = 0;

  for (const [row, col] of cells) {
    const cellValue = puzzle[row][col];
    puzzle[row][col] = null;

    const solutions = findAllSolutions(puzzle);

    if (solutions.length !== 1) {
      puzzle[row][col] = cellValue; 
    } else {
      numCellsRemoved++;
      if (numCellsRemoved === numCellsToRemove) {
        break;
      }
    }
  }

  return puzzle;
}

function cloneBoard(board: BoardState): BoardState {
  return board.map((row) => [...row]);
}

function findAllSolutions(board: BoardState): BoardState[] {
  const solutions: BoardState[] = [];

  function backtrack(row: number, col: number): void {
    if (row === 9) {
      solutions.push(cloneBoard(board));
      return;
    }

    const nextRow = col === 8 ? row + 1 : row;
    const nextCol = col === 8 ? 0 : col + 1;

    if (board[row][col] !== null) {
      backtrack(nextRow, nextCol);
    } else {
      for (let candidate = 1; candidate <= 9; candidate++) {
        if (isValidMove(board, row, col, candidate)) {
          board[row][col] = candidate;
          backtrack(nextRow, nextCol);
          board[row][col] = null;
        }
      }
    }
  }

  backtrack(0, 0);

  return solutions;
}

function solveSudoku(board: BoardState): BoardState | null {
    function solve(row: number, col: number): boolean {
      if (row === 9) {
        return true; 
      }
  
      if (board[row][col] !== null) {
    
        const nextRow = col === 8 ? row + 1 : row;
        const nextCol = col === 8 ? 0 : col + 1;
        return solve(nextRow, nextCol);
      }
  
      for (let num = 1; num <= 9; num++) {
        if (isValidMove(board, row, col, num)) {
          board[row][col] = num;
  
          const nextRow = col === 8 ? row + 1 : row;
          const nextCol = col === 8 ? 0 : col + 1;
  
          if (solve(nextRow, nextCol)) {
            return true;
          }
  
         
          board[row][col] = null;
        }
      }
  
      return false;
    }
  
    if (solve(0, 0)) {
      
      return board; 
    } else {
      return null; 
    }
  }
  

function Board({ difficulty }: { difficulty: Difficulty }) {
  const [solution, setSolution] = useState(generateBoard());
  const [board, setBoard] = useState(generatePuzzle(difficulty));
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [isSolved, setIsSolved] = useState(false);
  const [time, setTime] = useState(0);
 const [currentTime, setCurrentTime] = useState(formatTime(time)); // New state variable

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime((time) => time + 1);
      setCurrentTime(formatTime(time + 1)); // Update currentTime
    }, 1000);
    return () => clearInterval(intervalId);
  }, [time]); 

  const initiallyGeneratedCells: [number, number][] = [];
  const initialBoardSnapshot: BoardState = generatePuzzle(difficulty);

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (initialBoardSnapshot[row][col] !== null) {
        initiallyGeneratedCells.push([row, col]);
      }
    }
  }

  function handleCellClick(row: number, col: number) {
    const isInitiallyGenerated = initiallyGeneratedCells.some(
      ([generatedRow, generatedCol]) => generatedRow === row && generatedCol === col
    );

    if (!isInitiallyGenerated) {
      setSelectedCell([row, col]);
    }
  }



 


  function handleCellValueChange(row: number, col: number, value: CellValue) {
    const newBoard = [...board];
    newBoard[row][col] = value;
    setBoard(newBoard);
  }

  function getBoxIndex(row: number, col: number): number {
    return Math.floor(row / 3) * 3 + Math.floor(col / 3);
  }

  const selectedBoxIndex = selectedCell ? getBoxIndex(selectedCell[0], selectedCell[1]) : -1;

  function checkSolution() {
    const isBoardSolved = board.every((row, rowIndex) =>
      row.every((cellValue, colIndex) => cellValue === solution[rowIndex][colIndex])
    );
    setIsSolved(isBoardSolved);
  
    const newBoard = [...board];
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (newBoard[row][col] !== solution[row][col]) {
          newBoard[row][col] = null;
        }
      }
    }
    setBoard(newBoard);
  }

  function resetBoard() {
    setBoard(generatePuzzle(difficulty));
    setSelectedCell(null);
    setIsSolved(false);
  }


  function solvePuzzle() {
    const solvedBoard = solveSudoku([...board]);
    if (solvedBoard) {
      setBoard(solvedBoard);
      setIsSolved(true);
      setTime(0);
      setCurrentTime(formatTime(0));
    } else {
      alert("No solution exists for the given Sudoku puzzle.");
    }
  }

  function getHint(): void {
    const emptyCells: [number, number][] = [];

    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === null) {
          emptyCells.push([row, col]);
        }
      }
    }

    if (emptyCells.length === 0) {
      alert("The puzzle is already solved!");
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const [row, col] = emptyCells[randomIndex];

    const candidates = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);

    for (const candidate of candidates) {
      if (isValidMove(board, row, col, candidate)) {
        const newBoard = [...board];
        newBoard[row][col] = candidate;
        setBoard(newBoard);
        setSelectedCell([row, col]);
        return;
      }
    }

    alert("No valid move found for the selected cell.");
  }

  return (
    <div>
      {board.map((row, rowIndex) => (
  <div key={rowIndex}>
    {row.map((cellValue, colIndex) => {
      const isSameRow = selectedCell && selectedCell[0] === rowIndex;
      const isSameCol = selectedCell && selectedCell[1] === colIndex;
      const isSameBox = selectedCell && getBoxIndex(rowIndex, colIndex) === selectedBoxIndex;
      const isHighlighted = isSameRow || isSameCol || isSameBox;
      const isCellInitiallyGenerated = initiallyGeneratedCells.some(
        ([generatedRow, generatedCol]) =>
          generatedRow === rowIndex && generatedCol === colIndex
      );
      const isIncorrect = cellValue !== null && cellValue !== solution[rowIndex][colIndex];

      return (
        <Cell
          key={colIndex}
          value={cellValue}
          isSelected={selectedCell && selectedCell[0] === rowIndex && selectedCell[1] === colIndex ? true : false}
          isHighlighted={isHighlighted ? true : false}
          onClick={() => handleCellClick(rowIndex, colIndex)}
          onValueChange={(value) => handleCellValueChange(rowIndex, colIndex, value)}
          isLocked={isCellInitiallyGenerated}
          isIncorrect={isIncorrect} // new prop
        />
      );
    })}
  </div>
))}
      <GameControls checkSolution={checkSolution} solvePuzzle={solvePuzzle} resetBoard={resetBoard} getHint={getHint}/>
      {!isSolved && (
        <Timer />
      )}
    {isSolved && (
        
        <CongratulationsMessage isVisible={isSolved} />
    )}
    </div>
  );
}

export default Board;
