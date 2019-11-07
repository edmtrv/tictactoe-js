const DataModule = (() => {

})();

const UIModule = (() => {
  const DOMstrings = {
    startButton: '.btn',
    playerOneName: '.player-1-field',
    playerTwoName: '.player-2-field'
  };

  return {
    getDOMstrings() {
      return DOMstrings;
    }
  };
})();

const Controller = ((Data, UI) => {
  function setupEventListeners() {
    const DOM = UI.getDOMstrings();

    document.querySelector(DOM.startButton)
      .addEventListener('click', startGame);
  }

  function startGame() {
    console.log('GAME START');
  }

  return {
    init() {
      setupEventListeners();
    }
  };
})(DataModule, UIModule);


Controller.init();