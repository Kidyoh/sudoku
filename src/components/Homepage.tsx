import { useState } from 'react';
import Board, { Difficulty } from './Board';

function HomePage() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);

  function handleDifficultySelect(difficulty: Difficulty) {
    setSelectedDifficulty(difficulty);
  }

  return (
    <div className=" flex items-center justify-center bg-gray-100">
      <div className="flex items-center justify-center p-12 rounded-lg shadow-md ">
        {selectedDifficulty === null ? (
          <div>
            <h1 className="text-3xl font-semibold mb-4 text-black">Select a difficulty:</h1>
            <div className="space-x-4 my-4">
              <button
                onClick={() => handleDifficultySelect(Difficulty.Easy)}
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg cursor-pointer"
              >
                Easy
              </button>
              <button
                onClick={() => handleDifficultySelect(Difficulty.Medium)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-lg cursor-pointer"
              >
                Medium
              </button>
              <button
                onClick={() => handleDifficultySelect(Difficulty.Hard)}
                className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg cursor-pointer"
              >
                Hard
              </button>
            </div>
          </div>
        ) : (
          <Board  difficulty={selectedDifficulty} />
        )}
      </div>
    </div>
  );
}

export default HomePage;
