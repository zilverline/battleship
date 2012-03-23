var Cell = Backbone.Model.extend({
  defaults: {
    state: "empty"
  },
  fire: function() {
    this.trigger("fire", this);
  },
  updateState: function() {
    if (this.has("boat")) {
      this.get("boat").hit(this);
      this.set("state", "hit");
    } else {
      this.set("state", "miss");
    }
  }
});

var CellView = Backbone.View.extend({
  tagName: "td",
  className: "cell",
  events: {
    "click": "fire"
  },
  initialize: function() {
    _.bindAll(this, "renderBoat", "updateState", "disable");
    this.model.bind("change:boat", this.renderBoat)
    this.model.bind("change:state", this.updateState)
    this.model.bind("change:disabled", this.disable);
  },
  render: function() {
    this.$el.attr("id", "cell-" + this.model.get("x") + "-" + this.model.get("y"));
    // this.$el.html();
    this.renderBoat();
    return this;
  },
  renderBoat: function() {
    if (this.model.has('boat')) {
      if (this.model.get("boat").get("visible")) {
        this.$el.addClass("showBoat");
        this.$el.addClass(this.model.get("boat").get("type"));
      }
      this.model.get('boat').bind("change:visible", this.renderBoat);
    }
  },
  updateState: function() {
    if (this.model.get("state") == "hit") {
      this.$el.addClass("hit");
    } else if (this.model.get("state") == "miss") {
      this.$el.addClass("miss");
    }
  },
  fire: function() {
    this.$el.addClass("target");
    this.model.fire();
    this.$el.unbind("click");
  },
  disable: function() {
    this.$el.unbind("click");
  }
});