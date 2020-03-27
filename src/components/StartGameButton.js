import React from 'react';

const StartGameButton = props => (
  <button
    disabled={props.loading}
    onClick={props.startNewGame}
    className="center btn btn-primary"
  >
    START GAME
  </button>
);

export default StartGameButton;
