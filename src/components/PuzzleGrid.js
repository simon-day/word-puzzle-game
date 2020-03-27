import React from 'react';

const selectedLetterStyle = {
  color: 'red',
  fontWeight: 'bold',
  background: '#ffbcbc'
};

const PuzzleGrid = ({
  letters,
  gameEnded,
  input,
  selectLetter,
  indexesClicked,
  answers
}) => {
  //creates function to show list of duplicate letters and their index positions
  Array.prototype.getDuplicates = function() {
    var duplicates = {};
    for (var i = 0; i < this.length; i++) {
      if (duplicates.hasOwnProperty(this[i])) {
        duplicates[this[i]].push(i);
      } else if (this.lastIndexOf(this[i]) !== i) {
        duplicates[this[i]] = [i];
      }
    }
    return duplicates;
  };

  let letterDuplicates = letters.getDuplicates();

  let matchingIndex = [];
  for (let i = 0; i < input.length; i++) {
    if (!letterDuplicates[input[i]]) {
      matchingIndex.push(letters.indexOf(input[i]));
    } else {
      matchingIndex.push(letterDuplicates[input[i]][0]);
      letterDuplicates[input[i]].shift();
    }
  }

  if (gameEnded) {
    return (
      <div>
        <h2>GAME OVER!</h2>
        <p>You found {answers.length} total words</p>
      </div>
    );
  }

  return (
    <div className="wrap">
      <div className="grid">
        {letters.map((letter, i) => (
          <div
            onClick={() => selectLetter(letter, i)}
            key={i}
            style={
              (indexesClicked.length < 1 &&
                matchingIndex.includes(i) &&
                matchingIndex.length > 0) ||
              (indexesClicked && indexesClicked.includes(i))
                ? selectedLetterStyle
                : null
            }
            className="grid__item"
          >
            {letter.toUpperCase()}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PuzzleGrid;
