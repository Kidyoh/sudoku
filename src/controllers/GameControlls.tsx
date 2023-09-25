interface GameControlsProps {
  checkSolution: () => void;
  resetBoard: () => void;
  solvePuzzle: () => void;
  getHint: () => void;
}

function GameControls({ checkSolution, resetBoard, solvePuzzle, getHint }: GameControlsProps) {
  return (
    <div>
      <button onClick={checkSolution}>Check Solution</button>
      <button onClick={resetBoard}>Reset</button>
      <button onClick={solvePuzzle}>Solve Puzzle</button>
      <button onClick={getHint}>Get Hint</button>
    </div>
  );
}

export default GameControls;
