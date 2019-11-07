const DataModule = (() => {

})();

const UIModule = (() => {
  const DOMstrings = {
    gameButton: '.btn',
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

})(DataModule, UIModule);
