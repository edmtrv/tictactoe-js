const DataModule = (() => {
  const Player = (name, symbol) => {
    const getName = () => name;
    const getSymbol = () => symbol;

    return {getName, getSymbol};
  };

  const Board = () => {
    const grid = [null, null, null, null, null, null, null, null, null];
    const winCombos = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 4, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8], [2, 4, 6]
    ];

    const positionsBySymbol = (symbol) => {
      const positions = [];

      grid.forEach((mark, pos) => {
        if (mark === symbol) {
          positions.push(pos)
        }
      });

      return positions;
    };

    const isFull = () => {
      !grid.some(pos => pos === null);
    };

    const isWon = (currentSymbol) => {
      const positions = positionsBySymbol(currentSymbol);

      for (let combo of winCombos) {
        if (combo.every(c => positions.includes(c))) {
          return true;
        }
      }
      return false;
    };

    const markCell = (pos, symbol) => {
      grid[pos] = symbol;
    };

    const isEmptyCell = (pos) => {
      return !grid[pos];
    };

    return {markCell, isEmptyCell, isFull, isWon};
  };

  const Game = (board, ...players) => {
    const switchActivePlayer = () => players.reverse();
    const getActivePlayer = () => players[0];

    const isGameOver = () => board.isWon() || board.isFull();

    const turn = (position) => {
      const currentPlayer = getActivePlayer();

      if (!board.isEmptyCell(position)) {
        return;
      }

      board.markCell(position, currentPlayer.getSymbol());

      switchActivePlayer();

      return position;
    };

    return {turn, isGameOver};
  };

  return {Player, Board, Game};
})();


const UIModule = (() => {
  const DOMstrings = {
    startButton: '.btn',
    playerOneName: '.player-1-field',
    playerTwoName: '.player-2-field'
  };

  const getDOMstrings = () => {
    return DOMstrings;
  };

  return {
    getDOMstrings
  };
})();

const Controller = ((Data, UI) => {
  const DOM = UI.getDOMstrings();

  const startGame = () => {
    console.log('GAME START');
  }

  return {
    init() {
      document.querySelector(DOM.startButton)
        .addEventListener('click', startGame);
    }
  };
})(DataModule, UIModule);


Controller.init();