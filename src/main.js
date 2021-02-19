import React from 'react';
import ReactDOM from 'react-dom';
import './main.css';

class Board extends React.Component {
  render() {
    return (
      <form>
        <input type='text'id='search'/>
        <button>Search</button>
      </form>
    );
  }
}

// ======================================== \\

ReactDOM.render(
  <Board/>,
  document.getElementById('body')
);

