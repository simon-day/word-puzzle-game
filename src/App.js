import React, { Component } from 'react';
import axios from 'axios';
import PuzzleGrid from './components/PuzzleGrid';
import ShowWords from './components/ShowWords';
import ShowSolution from './components/ShowSolution';
import StartGameButton from './components/StartGameButton';
import GameOptionsButtons from './components/GameOptionsButtons';

const backupWords = [
  'adjacency',
  'abduction',
  'absorbant',
  'accepting',
  'afternoon',
  'backwoods',
  'balancing',
  'bannister',
  'barbecued',
  'barkeeper',
  'beautiful',
  'calcified',
  'cancelled',
  'captivity',
  'carpenter',
  'dangerous',
  'dartboard',
  'deadlines',
  'decimated',
  'eccentric',
  'education',
  'electoral',
  'empirical',
  'frequency',
  'fantastic',
  'fertility',
  'fisherman',
  'flippancy',
  'garnished',
  'generated',
  'glamorous',
  'graphical',
  'salivated',
  'scrounged',
  'secretion',
  'piggyback',
  'adjective',
  'misjudged'
];

// select a random backup word
const pickBackupWord = () => {
  const randomIndex = Math.floor(Math.random() * backupWords.length);
  return backupWords[randomIndex];
};

const AddWord = props => {
  return (
    <form
      onSubmit={event => props.addWord(event, props.currentInput)}
      className="add-word"
    >
      <input
        className="add-word-input"
        autoFocus
        type="text"
        placeholder="Add a new word"
        onChange={props.handleChange}
        value={props.currentInput}
      />
    </form>
  );
};

class App extends Component {
  state = {
    puzzleLetters: null,
    currentInput: [],
    answers: [],
    fetchedSolutions: [],
    message: 'empty',
    showAnswers: false,
    loading: true,
    startGame: false,
    indexesClicked: [],
    timeLeft: 180,
    gameOver: false
  };

  saveStateToLocalStorage() {
    // for every item in React state
    for (let key in this.state) {
      // save to localStorage
      localStorage.setItem(key, JSON.stringify(this.state[key]));
    }
  }

  componentDidMount() {
    if (localStorage.getItem('puzzleLetters') === null) {
      this.startNewGame();
    } else {
      this.setState({
        startGame: true,
        puzzleLetters: JSON.parse(localStorage.getItem('puzzleLetters')),
        answers: JSON.parse(localStorage.getItem('answers')),
        fetchedSolutions: JSON.parse(localStorage.getItem('fetchedSolutions'))
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.puzzleLetters !== prevState.puzzleLetters) {
      this.fetchSolution();
    } else {
      this.saveStateToLocalStorage();
    }
  }

  componentWillUnmount() {
    this.saveStateToLocalStorage();
  }

  startGameBtnHandler = () => {
    this.setState({ startGame: true });
  };

  restartGameBtnHandler = () => {
    this.startNewGame();
  };

  startTimer = () => {
    setInterval(() => {
      this.setState(prevState => ({ timeLeft: prevState.timeLeft - 1 }));
    }, 1000);
  };

  gameOver = () => {
    this.setState({ gameOver: true });
  };

  startNewGame = () => {
    this.setState({
      loading: true,
      answers: [],
      fetchedSolutions: [],
      showAnswers: false,
      message: 'empty',
      indexesClicked: []
    });
    axios
      .get(
        `https://api.wordnik.com/v4/words.json/randomWord?hasDictionaryDef=true&excludePartOfSpeech=affix%2Cfamily-name%2Cgiven-name&minCorpusCount=6000&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=9&maxLength=9&api_key=${process.env.REACT_APP_WORDNIK_KEY}
        `
      )
      .then(res => {
        const word = res.data.word.toUpperCase().split('');
        for (let i = word.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [word[i], word[j]] = [word[j], word[i]];
        }

        this.setState({ puzzleLetters: word, loading: false });
        this.startTimer();
      })
      .catch(() => {
        this.setState({
          puzzleLetters: pickBackupWord().split(''),
          loading: false
        });
        this.startTimer();
      });
  };

  selectLetter = (letter, i) => {
    if (this.state.indexesClicked.find(index => i === index)) {
      this.setState(prevState => ({
        indexesClicked: prevState.indexesClicked.filter(index => index !== i),
        currentInput: prevState.currentInput.slice(
          0,
          this.state.currentInput.lastIndexOf(letter)
        )
      }));
    } else {
      // console.log(i);
      this.setState(prevState => ({
        indexesClicked: [...prevState.indexesClicked, i],
        currentInput: prevState.currentInput + letter
      }));
    }
  };

  handleChange = event => {
    this.setState({
      currentInput: event.target.value.toUpperCase(),
      message: 'empty'
    });
  };

  addWordHandler = (event, word) => {
    event.preventDefault();
    if (this.checkValidWord(word) === null) {
    } else {
      this.setState(prevState => ({
        answers: [...prevState.answers, word.trim()],
        currentInput: '',
        message: 'Word added!',
        indexesClicked: []
      }));
    }
  };

  checkValidWord = word => {
    //checks word is long enough
    if (word.length < 4) {
      this.setState({
        message: 'Word too short',
        currentInput: '',
        indexesClicked: []
      });
      return null;
    }

    if (this.state.answers.indexOf(word) !== -1) {
      this.setState({
        message: 'Word already found!',
        currentInput: '',
        indexesClicked: []
      });
      return null;
    }

    // checks if letter has been used too many times
    word = word.toUpperCase().split('');
    const mappedWord = word.reduce((total, letter) => {
      total[letter] ? total[letter]++ : (total[letter] = 1);
      return total;
    }, {});
    const mappedPuzzle = this.state.puzzleLetters.reduce((total, letter) => {
      total[letter] ? total[letter]++ : (total[letter] = 1);
      return total;
    }, {});
    for (let i = 0; i < word.length; i++) {
      if (mappedWord[word[i]] > mappedPuzzle[word[i]]) {
        this.setState({
          message: 'Can only use each tile once',
          currentInput: '',
          indexesClicked: []
        });
        return null;
      }
    }

    // checks word is a real word found in the solutions
    if (this.state.fetchedSolutions.indexOf(word.join('')) === -1) {
      this.setState({
        message: 'Not a real word',
        currentInput: '',
        indexesClicked: []
      });
      return null;
    }
  };

  fetchSolution = () => {
    axios
      .get(
        `https://cors-anywhere.herokuapp.com/http://www.anagramica.com/all/:${this.state.puzzleLetters.join(
          ''
        )}`
      )
      .then(res => {
        return res.data.all.reduce(
          (total, word) =>
            word.length >= 4 ? total.concat(word.toUpperCase()) : total,
          []
        );
      })
      .then(fetchedSolutions =>
        this.setState({ fetchedSolutions, loading: false })
      )
      .catch(err => console.log(err));
  };

  getSolution = () => {
    this.setState(prevState => ({ showAnswers: !prevState.showAnswers }));
  };

  render() {
    let statusMessageStyle;

    if (this.state.message === 'empty') {
      statusMessageStyle = {
        visibility: 'hidden'
      };
    } else if (this.state.message === 'Word added!') {
      statusMessageStyle = {
        color: 'green'
      };
    } else {
      statusMessageStyle = {
        color: 'red'
      };
    }
    const wordsToGuess = this.state.fetchedSolutions.length;
    return (
      <div>
        <div className="title-area">
          <h2 className="h2 text-center pt-4">Word Finding Puzzle</h2>
          <p className="lead text-center m-4">
            Find as many 4 letter or longer words possible using a combination
            of the letters available. Each letter can only be used once.
          </p>
        </div>
        {this.state.startGame === false ? (
          <div className="container-fluid text-center">
            <StartGameButton
              loading={this.state.loading}
              startNewGame={this.startGameBtnHandler}
            />
          </div>
        ) : (
          <div className="container fluid">
            <div className="row">
              <div className="col-4 text-center answers">
                <section>
                  {this.state.showAnswers && (
                    <ShowSolution
                      userAnswers={this.state.answers}
                      answers={this.state.fetchedSolutions}
                    />
                  )}
                </section>
              </div>
              <div className="col-4 text-center">
                <section>
                  {this.state.loading ? (
                    <p className="status-message">...Loading words...</p>
                  ) : (
                    <p className="status-message">
                      {this.state.answers.length} out of {wordsToGuess} words
                      found
                    </p>
                  )}

                  <PuzzleGrid
                    answers={this.state.answers}
                    gameEnded={this.state.gameOver}
                    indexesClicked={this.state.indexesClicked}
                    selectLetter={this.selectLetter}
                    input={this.state.currentInput}
                    letters={this.state.puzzleLetters}
                  />
                  {/* <p className="status-message">{this.state.message}</p> */}
                  <AddWord
                    addWord={this.addWordHandler}
                    currentInput={this.state.currentInput}
                    handleChange={this.handleChange}
                  />
                  {!this.state.loading && (
                    <p style={statusMessageStyle} className="status-message">
                      {this.state.message}
                    </p>
                  )}
                  <GameOptionsButtons
                    loading={this.state.loading}
                    getSolution={this.getSolution}
                    startNewGame={this.startNewGame}
                    showAnswers={this.state.showAnswers}
                  />
                </section>
              </div>
              <div className="col-4 text-center answers">
                <section>
                  {this.state.answers.length > 0 && (
                    <ShowWords
                      words={this.state.answers}
                      answers={this.state.fetchedSolutions}
                      // removeWord={this.removeWord}
                    />
                  )}
                </section>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default App;
