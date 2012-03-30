describe('Battleship', function() {
  var game;

  var shotsPerIteration = 10;
  var maxShots = 30;
  var costPerShot = 5000;
  var startingFunds = maxShots * costPerShot;
  var sunkenBoatCellReward = 25000;

  beforeEach(function() {
    game = new Game({maxShots: maxShots, shotsPerIteration: shotsPerIteration, costPerShot: costPerShot, sunkenBoatCellReward: sunkenBoatCellReward});
  });

  it("should construct with shotsPerIteration and start with a funding of €400.000", function() {
    expect(game.get("shotsPerIteration")).toEqual(shotsPerIteration);
    expect(game.get("funds")).toEqual(startingFunds);
  });

  it("should update the shots remaining and funds when a shot is fired", function() {
    game.shotFired();
    expect(game.get("shotsRemainingForIteration")).toEqual(shotsPerIteration - 1);
    expect(game.get("shotsRemainingForGame")).toEqual(maxShots - 1);
    expect(game.get("funds")).toEqual(startingFunds - costPerShot)
  });

  it("should update the funds when a boat is sunken", function() {
    var boat = new Boat({type: "aircraft-carrier"});
    game.sunkenBoat(boat);
    expect(game.get("funds")).toEqual(startingFunds + sunkenBoatCellReward * boat.length());
  });

});