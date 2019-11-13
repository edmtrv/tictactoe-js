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

    const getWinCombo = (symbol) => {
      const positions = positionsBySymbol(symbol);

      for (let combo of winCombos) {
        if (combo.every(c => positions.includes(c))) {
          return combo;
        }
      }
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

    return {markCell, isEmptyCell, isFull, isWon, getWinCombo};
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

    const getWinCombo = () => board.getWinCombo(getWinner().getSymbol());

    const turn = (position) => {
      if (!board.isEmptyCell(position)) return;
      const symbol = getActivePlayer().getSymbol();

      board.markCell(position, symbol);

      return {position, symbol};
    };

    return {
      turn, isGameOver, getWinner,
      getActivePlayer, switchActivePlayer, getWinCombo
    };
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
    drawSymbol(cell, symbol);
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

  const drawSymbol = (cell, symbol) => {
    const w = cell.offsetWidth;
    const h = cell.offsetHeight;
    const ctx = cell.getContext('2d');
    cell.width = w;
    cell.height = h;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.lineWidth = 5;

    if (symbol === 'x') {
      ctx.strokeStyle = '#34495e';
      drawX(ctx, w, h);
    } else if (symbol === 'o') {
      ctx.strokeStyle = '#f39c12';
      drawO(ctx, w, h);
    }
  };

  const drawX = (ctx, w, h) => {
    ctx.beginPath();
    ctx.moveTo(w / 4, h / 4);
    ctx.lineTo(w - (w / 4), h - (h / 4));
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(w - (w / 4), h / 4);
    ctx.lineTo(w / 4, h - (h / 4));
    ctx.stroke();
  };

  const drawO = (ctx, w, h) => {
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, w / 4, 0, 2 * Math.PI);
    ctx.stroke();
  };

  const showWinCombo = (combo) => {
    for (let c of combo) {
      const el = document.querySelector(DOMstrings.cell(c));
      el.style.background = '#2ecc71';
    }
  };

  return {getDOMstrings, markPosition, showResult, showWinCombo};
})();

const Controller = ((Data, UI) => {
  const DOM = UI.getDOMstrings();

  const setupGame = () => {
    const pXName = document.querySelector(DOM.playerXName).value;
    const pOName = document.querySelector(DOM.playerOName).value;
    const playerX = Data.Player(pXName, 'x');
    const playerO = Data.Player(pOName, 'o');
    const game = Data.Game(Data.Board(), playerX, playerO);

    const boardNode = document.querySelector(DOM.board);

    const runGame = (e) => {
      const clickedCell = +e.target.dataset.cell;

      if (clickedCell === undefined) return;

      const mark = game.turn(clickedCell);

      if (mark !== undefined) {
        UI.markPosition(mark);
      }

      if (game.isGameOver()) {
        UI.showWinCombo(game.getWinCombo());
        UI.showResult(game.getWinner());
        boardNode.removeEventListener('click', runGame);
      }

      game.switchActivePlayer();
    }

    boardNode.addEventListener('click', runGame);
  }

  return {
    init() {
      document.querySelector(DOM.startButton)
        .addEventListener('click', setupGame);
    }
  };
})(DataModule, UIModule);


Controller.init();