var Boat = Backbone.Model.extend({
  initialize: function(args) {
    this.hits = 0;
  },
  boatLengths: {
    "aircraft-carrier": 5,
    "battleship": 4,
    "submarine": 3,
    "cruiser": 3,
    "destroyer": 2
  },
  defaults: {
    "visible": false
  },
  length: function() {
    return this.boatLengths[this.get("type")];
  },
  setCells: function(cells) {
    this.cells = cells;
    var self = this;
    _(cells).each(function(cell) {
      cell.set("boat", self);
    });
  },
  hit: function(cell) {
    this.hits++;
    if (this.sunken()) {
      this.set("visible", true);
      this.trigger("sunken", this);
    }
  },
  sunken: function() {
    return this.cells.length <= this.hits;
  }
});