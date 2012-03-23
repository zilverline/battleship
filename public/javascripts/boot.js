$(function() {
  var game;

  $("#newGame").bind("click", function() {
    if (game) {
      game.destroy();
    }
    game = new Game({shotsPerIteration: $("#shotsPerIteration").val()});
    new GameView({model: game}).render();
  });
});