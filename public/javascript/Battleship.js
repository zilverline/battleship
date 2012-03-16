$(function () {
  newGame();

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

function initializeFleet() {
  var fleets = new Array();

  var fleet1 = new Array(5);
  fleet1[0] = {id:'aircraft-carrier', x:0, y:0, size:5, direction:'horizontal'};
  fleet1[1] = {id:'battleship', x:0, y:2, size:4, direction:'vertical'};
  fleet1[2] = {id:'submarine', x:4, y:3, size:3, direction:'horizontal'};
  fleet1[3] = {id:'cruiser', x:6, y:7, size:3, direction:'horizontal'};
  fleet1[4] = {id:'destroyer', x:7, y:1, size:2, direction:'vertical'};
  fleets.push(fleet1);

  var fleet2 = new Array(5);
  fleet2[0] = {id:'aircraft-carrier', x:4, y:8, size:5, direction:'horizontal'};
  fleet2[1] = {id:'battleship', x:3, y:5, size:4, direction:'vertical'};
  fleet2[2] = {id:'submarine', x:1, y:3, size:3, direction:'vertical'};
  fleet2[3] = {id:'cruiser', x:6, y:6, size:3, direction:'horizontal'};
  fleet2[4] = {id:'destroyer', x:7, y:1, size:2, direction:'vertical'};
  fleets.push(fleet2);

  var fleet3 = new Array(5);
  fleet3[0] = {id:'aircraft-carrier', x:5, y:9, size:5, direction:'horizontal'};
  fleet3[1] = {id:'battleship', x:1, y:9, size:4, direction:'horizontal'};
  fleet3[2] = {id:'submarine', x:1, y:1, size:3, direction:'vertical'};
  fleet3[3] = {id:'cruiser', x:2, y:1, size:3, direction:'horizontal'};
  fleet3[4] = {id:'destroyer', x:9, y:7, size:2, direction:'vertical'};
  fleets.push(fleet3);

  var fleet4 = new Array(5);
  fleet4[0] = {id:'aircraft-carrier', x:3, y:4, size:5, direction:'horizontal'};
  fleet4[1] = {id:'battleship', x:5, y:7, size:4, direction:'horizontal'};
  fleet4[2] = {id:'submarine', x:7, y:2, size:3, direction:'horizontal'};
  fleet4[3] = {id:'cruiser', x:2, y:1, size:3, direction:'horizontal'};
  fleet4[4] = {id:'destroyer', x:1, y:8, size:2, direction:'horizontal'};
  fleets.push(fleet4);

  var fleet5 = new Array(5);
  fleet5[0] = {id:'aircraft-carrier', x:3, y:4, size:5, direction:'vertical'};
  fleet5[1] = {id:'battleship', x:5, y:6, size:4, direction:'vertical'};
  fleet5[2] = {id:'submarine', x:7, y:2, size:3, direction:'vertical'};
  fleet5[3] = {id:'cruiser', x:2, y:1, size:3, direction:'vertical'};
  fleet5[4] = {id:'destroyer', x:1, y:8, size:2, direction:'vertical'};
  fleets.push(fleet5);

  var randomIndex = Math.floor(Math.random() * fleets.length);
  return fleets[randomIndex];
}

function drawFleet(fleet) {
  for (var i = 0; i < fleet.length; i++) {
    var boat = fleet[i];
    drawBoat(boat);
  }
}

function drawBoat(boat) {
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
  var fleet = initializeFleet();
  drawFleet(fleet);
}

function buildCellId(x, y) {
  return 'cell-' + x + '-' + y;
}