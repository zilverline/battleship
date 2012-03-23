var Game = Backbone.Model.extend({
  defaults: {
    maxShots: 40
  },
  initialize: function(args) {
    _.bindAll(this, "sunkenBoat", "shotFired");
        
    this.set("shotsPerIteration", args.shotsPerIteration);
    this.set("shotsRemaining", args.shotsPerIteration);
    this.set("shots", this.get("maxShots"));
    
    this.sunken = 0;
    this.set("board", new Board());
    this.get("board").bind("fire", this.shotFired);

    var directions = ["vertical", "horizontal"];

    var self = this;
    var board = this.get("board");
    _(["aircraft-carrier","battleship","submarine","cruiser","destroyer"]).each(function(type) {
      var placed = false;
      while(!placed) {
        var boat = new Boat({x: self.random(board.get("gridSize").x + 1), y: self.random(board.get("gridSize").y + 1), direction: directions[self.random(2)], type: type, visible: false})
        if(board.validBoatPlacement(boat)) {
          self.addBoat(boat);
          placed = true;
        }
      }
    });
    

    // this.addBoat(new Boat({x: 5, y: 3, direction: "horizontal", type: "destroyer", visible: false}));
  },
  random: function(max) {
    return Math.floor(Math.random()*max);
  },
  destroy: function() {
    this.get("board").destroy();
    Game.__super__.destroy();
  },
  addBoat: function(boat) {
    boat.bind("sunken", this.sunkenBoat);
    this.get("board").addBoat(boat);
  },
  shotFired: function() {
    this.set("shotsRemaining", this.get("shotsRemaining") - 1);
    
    if (this.get("shotsRemaining") <= 0) {
      this.set("shotsRemaining", this.get("shotsPerIteration"));
      this.get("board").showFeedback();
    }
    
    this.set("shots", this.get("shots") - 1);
    if (this.get("shots") <= 0) {
      this.endGame();
    }
  },
  sunkenBoat: function() {
    this.sunken++;
    if (this.fleetDestroyed()) {
      this.endGame();
    }
  },
  fleetDestroyed: function() {
    return this.sunken >= this.get("board").fleetSize();
  },
  endGame: function() {
    if (!this.has("state")) {
      if (this.fleetDestroyed()) {
        this.set("state", "win");
      } else {
        this.set("state", "lose");
      }

      this.get("board").disable();
      this.get("board").showFeedback();
      this.get("board").showFleet();
    }
  }
});

var GameView = Backbone.View.extend({
  initialize: function(args) {
    _.bindAll(this, "updateShotCount", "updateState");
    this.model.bind("change:shots", this.updateShotCount);
    this.model.bind("change:state", this.updateState);
  },
  render: function() {
    this.boardView = new BoardView({model: this.model.get("board")});
    $("#container").append(this.boardView.render().el);
    this.updateShotCount();
    $("#result").html("");
    return this;
  },
  updateShotCount: function() {
    $("#shotsRemainingForIteration").html(this.model.get("shotsRemaining"));
    $("#totalShotsRemaining").html(this.model.get("shots"));
  },
  updateState: function(model, state) {
    if (state === "lose") {
      $("#result").html("Game Over");
    } else {
      $("#result").html("You win!");
    }
  }
});
