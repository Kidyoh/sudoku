import { useState } from 'react';
import Board, { Difficulty } from './Board';

function HomePage() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);

  function handleDifficultySelect(difficulty: Difficulty) {
    setSelectedDifficulty(difficulty);
  }

  return (
    <div>
      {selectedDifficulty === null ? (
        <div>
          <h1>Select a difficulty:</h1>
          <button onClick={() => handleDifficultySelect(Difficulty.Easy)}>Easy</button>
          <button onClick={() => handleDifficultySelect(Difficulty.Medium)}>Medium</button>
          <button onClick={() => handleDifficultySelect(Difficulty.Hard)}>Hard</button>
        </div>
      ) : (
        <Board difficulty={selectedDifficulty} />
      )}
    </div>
  );
}

export default HomePage;