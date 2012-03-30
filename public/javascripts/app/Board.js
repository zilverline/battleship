var Board = Backbone.Model.extend({
  defaults: {
    gridSize: {
      x: 10,
      y: 10
    }
  },
  initialize: function(args) {
    this.fleet = [];
    this.grid = [];
    this.targets = [];
    _.bindAll(this, "fire");
    
    for (var y = 0; y < this.get('gridSize').y; y++) {
      this.grid[y] = [];
      for (var x = 0; x < this.get('gridSize').x; x++) {
        var cell = new Cell({x: x, y: y});
        cell.bind("fire", this.fire);
        this.grid[y][x] = cell;
      }
    }
  },
  getGrid: function() {
    return this.grid;
  },
  getCell: function(x, y) {
    if(this.grid[y] === undefined) {
      return undefined;
    } else {
      return this.grid[y][x];
    }
  },
  fire: function(cell) {
    this.targets.push(cell);
    
    this.trigger("fire");
  },
  showFeedback: function() {
    _(this.targets).each(function(cell) {
      cell.updateState();
    });
    this.targets = [];
  },
  addBoat: function(boat) {
    this.fleet.push(boat);
    var cells = this.getCellsForBoat(boat);
    boat.setCells(cells);
    this.trigger("add:boat", boat);
  },
  getCellsForBoat: function(boat) {
    var cells = [];
    if (boat.get("direction") === "horizontal") {
      for(var i = boat.get("x"); i < boat.get("x") + boat.length(); i++) {
        cells.push(this.getCell(i, boat.get("y")));
      }
    } else {
      for(var i = boat.get("y"); i < boat.get("y") + boat.length(); i++) {
        cells.push(this.getCell(boat.get("x"), i));
      }
    }
    return cells;
  },
  validBoatPlacement: function(boat) {
    var self = this;
    var cells = this.getCellsForBoat(boat);
    return !_(cells).any(function(cell) {
      
      if (!cell) {
        return true;
      }
      var edgeCells = [];      
      edgeCells.push(self.getCell(cell.get("x") + 1, cell.get("y")));
      edgeCells.push(self.getCell(cell.get("x") - 1, cell.get("y")));
      edgeCells.push(self.getCell(cell.get("x"), cell.get("y") + 1));
      edgeCells.push(self.getCell(cell.get("x"), cell.get("y") - 1));
      
      return _(edgeCells).any(function(cell) {
        return cell === undefined || cell.has("boat");
      });
      
    });
  },
  fleetSize: function() {
    return this.fleet.length;
  },
  disable: function() {
    this.set("disabled", true);
    for (var y = 0; y < this.get('gridSize').y; y++) {
      for (var x = 0; x < this.get('gridSize').x; x++) {
        this.grid[y][x].set("disabled", true);
      }
    }
  },
  showFleet: function() {
    _(this.fleet).each(function(boat) {
      boat.set("visible", true);
    });
  }
});

var BoardView = Backbone.View.extend({
  tagName: "table",
  className: "board",
  initialize: function() {
    _.bindAll(this, "removeBoard");
    this.model.bind("destroy", this.removeBoard);
  },
  removeBoard: function() {
    this.remove();
  },
  render: function() {
    var self = this;
    _(this.model.getGrid()).each(function(row) {
      var tr = $("<tr />");
      _(row).each(function(cell) {
        tr.append(new CellView({model: cell}).render().el);
      });
      self.$el.append(tr);
    });
    return this;
  }
});