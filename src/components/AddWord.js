import React, { Component } from 'react';

class AddWord extends Component {
  state = {
    currentInput: ''
  };

  handleChange = event => {
    this.setState({ currentInput: event.target.value });
  };

  render() {
    return (
      <form
        onSubmit={event => this.props.addWord(event, this.state.currentInput)}
        className="add-word"
        disabled={this.props.loading ? 'disabled' : ''}
      >
        <input
          className="add-word-input"
          autoFocus
          type="text"
          placeholder="Add a new word"
          onChange={this.handleChange}
          value={this.state.currentInput.toUpperCase()}
        />
      </form>
    );
  }
}

export default AddWord;
