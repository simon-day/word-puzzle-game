import React from 'react';

const GameOptionsButtons = ({
  getSolution,
  showAnswers,
  startNewGame,
  loading
}) => {
  const btnText = showAnswers ? 'Hide Answers' : 'Show Answers';
  return (
    <div className="btn-group-vertical ">
      <button
        className="btn btn-outline-warning main-btns"
        onClick={getSolution}
      >
        {btnText}
      </button>
      <button
        onClick={startNewGame}
        disabled={loading}
        className="btn btn-success main-btns"
      >
        New Game
      </button>
    </div>
  );
};

export default GameOptionsButtons;
