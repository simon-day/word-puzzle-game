import React from 'react';

const ShowWords = ({ answers, words }) => {
  const fourLetterWords = words.filter(word => word.length === 4);
  const fiveLetterWords = words.filter(word => word.length === 5);
  const sixLetterWords = words.filter(word => word.length === 6);
  const sevenLetterWords = words.filter(word => word.length === 7);
  const eightLetterWords = words.filter(word => word.length === 8);
  const nineLetterWords = words.filter(word => word.length === 9);
  return (
    <div className="row">
      <div className="col">
        <ul className="list-group">
          {fourLetterWords.length > 0 && (
            <h3 className="h4 text-center">4 Letter Words:</h3>
          )}
          {fourLetterWords.sort().map(word => (
            <li className="list-group-item" key={word}>
              <a
                href={`https://www.dictionary.com/browse/${word}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {word}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div className="col">
        <ul className="list-group">
          {fiveLetterWords.length > 0 && (
            <h3 className="h4 text-center">5 Letter Words:</h3>
          )}
          {fiveLetterWords.sort().map(word => (
            <li className="list-group-item" key={word}>
              <a
                href={`https://www.dictionary.com/browse/${word}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {word}
              </a>
            </li>
          ))}
        </ul>

        <ul className="list-group">
          {sixLetterWords.length > 0 && (
            <h3 className="h4 text-center">6 Letter Words:</h3>
          )}
          {sixLetterWords.sort().map(word => (
            <li className="list-group-item" key={word}>
              <a
                href={`https://www.dictionary.com/browse/${word}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {word}
              </a>
            </li>
          ))}
        </ul>

        <ul className="list-group">
          {sevenLetterWords.length > 0 && (
            <h3 className="h4 text-center">7 Letter Words:</h3>
          )}
          {sevenLetterWords.sort().map(word => (
            <li className="list-group-item" key={word}>
              <a
                href={`https://www.dictionary.com/browse/${word}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {word}
              </a>
            </li>
          ))}
        </ul>

        <ul className="list-group">
          {eightLetterWords.length > 0 && (
            <h3 className="h4 text-center">8 Letter Words:</h3>
          )}
          {eightLetterWords.sort().map(word => (
            <li className="list-group-item" key={word}>
              <a
                href={`https://www.dictionary.com/browse/${word}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {word}
              </a>
            </li>
          ))}
        </ul>

        <ul className="list-group">
          {nineLetterWords.length > 0 && (
            <h3 className="h4 text-center">9 Letter Words:</h3>
          )}
          {nineLetterWords.sort().map(word => (
            <li className="list-group-item" key={word}>
              <a
                href={`https://www.dictionary.com/browse/${word}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {word}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ShowWords;
