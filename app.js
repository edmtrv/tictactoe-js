const DataModule = (() => {
  const Player = (name, symbol) => {
    const getName = () => name;
    const getSymbol = () => symbol;

    return {getName, getSymbol};
  };

  const Board = () => {
    const board = [null, null, null, null, null, null, null, null, null];
    const markCell = (pos, symbol) => {
      board[pos] = symbol;
    };

    const isEmptyCell = (pos) => {
      return !board[pos];
    };

    return {markCell, isEmptyCell};
  };
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