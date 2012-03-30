# encoding: utf-8
require 'spec_helper'

describe "Game" do

  before :each do
    visit '/index.html'
  end

  describe "with a random fleet" do

    it "should start a new game" do
      fill_in 'shotsPerIteration', with: 10
      click_on 'newGame'

      assert_counters(40, 10, "€ 400.000")
    end

  end

  describe "with a preset fleet" do

    before :each do
      page.execute_script <<-EOF
      var game = new Game({shotsPerIteration: 2});
      game.addBoat(new Boat({x: 0, y: 0, direction: 'horizontal', type: 'destroyer'}));
      new GameView({model: game}).render();
      EOF
    end

    it "should fire a shot and mark the cell as a target" do
      find('#cell-0-0').click

      assert_counters(39, 1, "€ 390.000")
      page.should have_css "#cell-0-0.target"
    end

    it "should fire two shots and give feedback" do
      find('#cell-0-0').click
      find('#cell-0-1').click

      assert_counters(38, 2, "€ 380.000")
      page.should have_css "#cell-0-0.hit"
      page.should have_css "#cell-0-1.miss"
    end

    it "should fire several shots and sink a boat" do
      find('#cell-0-0').click
      find('#cell-1-0').click

      assert_counters(38, 2, "€ 480.000")
      page.should have_css "#cell-0-0.hit"
      page.should have_css "#cell-1-0.hit"
    end

  end

  def assert_counters(total_shots_remaining, shots_remaining_for_iteration, funds)
    find('#totalShotsRemaining').should have_content(total_shots_remaining.to_s)
    find('#shotsRemainingForIteration').should have_content(shots_remaining_for_iteration.to_s)
    find('#funds').should have_content(funds)
  end

end