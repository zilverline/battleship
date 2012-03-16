$(function() {
  newGame();

  $('#newGame').click(function() {
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
  if(shotsRemainingForIteration.val() == 0) {
    showTargetFeedback();
    shotsRemainingForIteration.val($('#shotsPerIteration').val());
  }
}

function endGameIfNoShotsRemaining() {
  var totalShotsRemaining = $('#totalShotsRemaining');
  if(totalShotsRemaining.val() == 0) {
    showFleet();
    $('.cell').off('click');
  }
}

function drawGrid(grid) {
  var table = $('<table id="grid" cellpadding="0" cellspacing="0">');
  for(var i = 0; i < grid.length; i++) {
    var tr = $('<tr>');
    table.append(tr);
    for(var j = 0; j < grid[i].length; j++) {
      var td = $('<td>');
      td.attr('id', buildCellId(j, i));
//      td.text(j + ',' + i);
      td.addClass('cell');
      tr.append(td);
    }
  }

  var container = $('#container');
  container.empty();
  container.append(table);

  $('.cell').click(function() {
    $(this).addClass('target');
    updateShotCounters();
    showTargetFeedbackIfEndOfIteration();
    endGameIfNoShotsRemaining();
  });
}

function initializeFleet() {
  var fleet = new Array(5);
  fleet[0] = {id: 'aircraft-carrier', x: 0, y: 0, size: 5, direction: 'horizontal'};
  fleet[1] = {id: 'battleship', x: 0, y: 2, size: 4, direction: 'vertical'};
  fleet[2] = {id: 'submarine', x: 4, y: 3, size: 3, direction: 'horizontal'};
  fleet[3] = {id: 'cruiser', x: 6, y: 7, size: 3, direction: 'horizontal'};
  fleet[4] = {id: 'destroyer', x: 7, y: 1, size: 2, direction: 'vertical'};
  return fleet;
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
  for(var i = 0; i < boat.size; i++) {
    var cell = $('#' + buildCellId(x, y));
    cell.addClass('boat');
    cell.addClass(boat.id);
    if(boat.direction == 'horizontal') {
      x++;
    } else {
      y++;
    }
  }
}

function showFleet() {
  $('#grid').addClass('showBoats');
}

function showTargetFeedback() {
  var targets = $('.target');
  for (var i = 0; i < targets.length; i++) {
    var target = $(targets[i]);
    target.removeClass('target');
    if(target.hasClass('boat')) {
      target.addClass('hit');
    } else {
      target.addClass('miss');
    }
  }
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