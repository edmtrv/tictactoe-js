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

    const isFull = () => !grid.some(pos => pos === null);

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

    const isEmptyCell = (pos) => !grid[pos];

    return {markCell, isEmptyCell, isFull, isWon};
  };

  const Game = (board, ...players) => {
    const switchActivePlayer = () => players.reverse();

    const getActivePlayer = () => players[0];

    const isGameOver = () => {
      return board.isWon(getActivePlayer().getSymbol()) || board.isFull()
    };

    const getWinner = () => {
      return board.isWon(getActivePlayer().getSymbol()) && players[0];
    };

    const turn = (position) => {
      if (!board.isEmptyCell(position)) return;
      const symbol = getActivePlayer().getSymbol();

      board.markCell(position, symbol);

      return {position, symbol};
    };

    return {turn, isGameOver, getWinner, getActivePlayer, switchActivePlayer};
  };

  return {Player, Board, Game};
})();


const UIModule = (() => {
  const DOMstrings = {
    startButton: '.btn',
    playerXName: '#player-x-name',
    playerOName: '#player-o-name',
    board: '.board',
    result: '.result',
    cell(n) { return `[data-cell="${n}"]`},
  };

  const getDOMstrings = () => DOMstrings;

  const markPosition = ({position, symbol}) => {
    const cell = document.querySelector(DOMstrings.cell(position));
    cell.textContent = symbol;
  };

  const showResult = (player = null) => {
    const resultNode = document.querySelector(DOMstrings.result);

    if (player) {
      resultNode.innerHTML = `
        <p class="result-msg">
          ${player.getName()} with ${player.getSymbol()} has won!
        </p>
      `;
    } else {
      resultNode.innerHTML = `<p class="result-msg">DRAW!</p>`;
    }
  };

  return {getDOMstrings, markPosition, showResult};
})();

const Controller = ((Data, UI) => {
  const DOM = UI.getDOMstrings();

  const setupGame = () => {
    const pXName = document.querySelector(DOM.playerXName).value;
    const pOName = document.querySelector(DOM.playerOName).value;
    const playerX = Data.Player(pXName, 'x');
    const playerO = Data.Player(pOName, 'o');
    const game = Data.Game(Data.Board(), playerX, playerO);

    document.querySelector(DOM.board).addEventListener('click', e => {
      const clickedCell = +e.target.dataset.cell;

      if (clickedCell === undefined) return;

      const markedPosition = game.turn(clickedCell);

      if (markedPosition !== undefined) {
        UI.markPosition(markedPosition);
      }

      if (game.isGameOver()) {
        UI.showResult(game.getWinner());
        return;
      }

      game.switchActivePlayer();
    });
  }

  return {
    init() {
      document.querySelector(DOM.startButton)
        .addEventListener('click', setupGame);
    }
  };
})(DataModule, UIModule);


Controller.init();