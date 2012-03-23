$(function () {
  newGame();
  endGame();
  $('#newGame').click(function () {
    newGame();
  });
});

function initializeGrid(rows, columns) {
  var grid = new Array(rows);
  for (var i = 0; i < grid.length; i++) {
    grid[i] = new Array(columns);
  }
  return grid;
}

function updateShotCounters() {
  var totalShotsRemaining = $('#totalShotsRemaining');
  var value = totalShotsRemaining.val();
  totalShotsRemaining.val(--value);

  var shotsRemainingForIteration = $('#shotsRemainingForIteration');
  var value = shotsRemainingForIteration.val();
  shotsRemainingForIteration.val(--value);
}

function showTargetFeedbackIfEndOfIteration() {
  var shotsRemainingForIteration = $('#shotsRemainingForIteration');
  if (shotsRemainingForIteration.val() == 0) {
    showTargetFeedback();
    shotsRemainingForIteration.val($('#shotsPerIteration').val());
  }
}

function endGameIfNoShotsRemaining() {
  var totalShotsRemaining = $('#totalShotsRemaining');
  if (totalShotsRemaining.val() == 0) {
    endGame();
  }
}

function endGameIfAllShipsSunk() {
  if($('.boat.hit').length == $('.boat').length) {
    endGame();
  }
}

function endGame() {
  showFleet();
  $('.cell').off('click');
}

function drawGrid(grid) {
  var table = $('<table id="grid" cellpadding="0" cellspacing="0">');
  for (var i = 0; i < grid.length; i++) {
    var tr = $('<tr>');
    table.append(tr);
    for (var j = 0; j < grid[i].length; j++) {
      var td = $('<td>');
      td.attr('id', buildCellId(j, i));
      //td.text(j + ',' + i);
      td.addClass('cell');
      tr.append(td);
    }
  }

  var container = $('#container');
  container.empty();
  container.append(table);

  $('.cell').click(function () {
    $(this).addClass('target');
    updateShotCounters();
    showTargetFeedbackIfEndOfIteration();
    endGameIfNoShotsRemaining();
  });
}

function randomFleetDeployment() {
  var fleet = new Array(5);
  fleet[0] = {id:'aircraft-carrier', size:5, direction: randomDirection() };
  fleet[1] = {id:'battleship', size:4, direction: randomDirection() };
  fleet[2] = {id:'submarine', size:3, direction: randomDirection() };
  fleet[3] = {id:'cruiser', size:3, direction: randomDirection() };
  fleet[4] = {id:'destroyer', size:2, direction: randomDirection() };
  
  var fleetWithPositions = randomDeployShips(fleet);
  
  return fleetWithPositions;
}

function randomDirection(){
  var random = Math.random();
  var direction = 'vertical';

  if(random<0.5){
    direction = 'horizontal';
  }
  return direction;
}

function randomDeployShips(fleet){
  var fleetWithPositions = new Array();
  var reservedCoordinates = new Array();

  for(var i = 0; i<fleet.length;i++){
    var ship = fleet[i];
    var x1 = 0;
    var y1 = 0;

    if(ship.direction == 'horizontal'){
      x1 = getRandomCoordinate(9 - ship.size);
      y1 = getRandomCoordinate(9);
    } else {
      x1 = getRandomCoordinate(9);
      y1 = getRandomCoordinate(9 - ship.size);
    }

    var proposedShipCoordinates = getCoordinates(ship, x1, y1);

    var isFree = true;
    
    for(var i1 = 0; i1<reservedCoordinates.length;i1++){
      var reservedCoordinaten = reservedCoordinates[i1];

      for(var i2 = 0; i2<reservedCoordinaten.length;i2++){

        var reservedCoordinate =reservedCoordinaten[i2]; 

        for(var j = 0; j<proposedShipCoordinates.length;j++){
          var proposedCoordinate = proposedShipCoordinates[j];
        
          if(proposedCoordinate == reservedCoordinate){
            
            isFree = false;
          }
        }
      }  
    }

    if(isFree){

      var shipWithCoordinate = {id: ship.id, x: x1, y: y1, size: ship.size, direction: ship.direction};
      fleetWithPositions.push(shipWithCoordinate);
      reservedCoordinates.push(proposedShipCoordinates);

    } else {
      i--;
    }
  
  }
  
  return fleetWithPositions;
}

function getCoordinates(ship, x, y){
  var reservedCoordinates = new Array();

  if(ship.direction == 'horizontal'){
    for(var i = x; i<x+ship.size;i++){
      reservedCoordinates.push('('+ i +','+ y + ')');
    }
  } else {
    for(var i = y; i<y+ship.size;i++){
      reservedCoordinates.push('('+ x +','+ i + ')');
    }
  }

  return reservedCoordinates;
}

function getRandomCoordinate(max){

  return Math.floor(Math.random() * max);
}

function drawFleet(fleet) {
  for (var i = 0; i < fleet.length; i++) {
    var boat = fleet[i];
    drawBoat(boat);
  }
}

function drawBoat(boat) {
  console.log(boat);

  var x = boat.x;
  var y = boat.y;
  for (var i = 0; i < boat.size; i++) {
    var cell = $('#' + buildCellId(x, y));
    cell.addClass('boat');
    cell.addClass(boat.id);
    cell.attr('data-type', boat.id);
    if (boat.direction == 'horizontal') {
      x++;
    } else {
      y++;
    }
  }
}

function showFleet() {
  $('.boat').addClass('showBoat');
}

function showTargetFeedback() {
  var targets = $('.target');
  for (var i = 0; i < targets.length; i++) {
    var target = $(targets[i]);
    target.removeClass('target');
    if (target.hasClass('boat')) {
      target.addClass('hit');
      showBoatIfSunk(target);
    } else {
      target.addClass('miss');
    }
  }
}

function showBoatIfSunk(target) {
  var boatType = target.attr('data-type');
  var boatCells = $("." + boatType);

  for (var i = 0; i < boatCells.length; i++) {
    var boatCell = $(boatCells[i]);
    if (!boatCell.hasClass('hit')) {
      return;
    }
  }

  showBoat(boatType);
  endGameIfAllShipsSunk();
}

function showBoat(boatType) {
  $("." + boatType).addClass('showBoat');
}

function newGame() {
  var shotsPerIteration = $('#shotsPerIteration');
  $('#totalShotsRemaining').val(40);
  $('#shotsRemainingForIteration').val(shotsPerIteration.val());

  var grid = initializeGrid(10, 10);
  drawGrid(grid);
  var fleet = randomFleetDeployment();
  console.log(fleet); 
  drawFleet(fleet);
}

function buildCellId(x, y) {
  return 'cell-' + x + '-' + y;
}