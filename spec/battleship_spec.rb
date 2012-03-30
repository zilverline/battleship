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
      var game = new Game({shotsPerIteration: 2, fleet: [
        new Boat({x: 0, y: 0, direction: 'horizontal', type: 'destroyer'}),
        new Boat({x: 4, y: 1, direction: 'horizontal', type: 'aircraft-carrier'}),
        new Boat({x: 2, y: 3, direction: 'vertical', type: 'submarine'}),
        new Boat({x: 4, y: 5, direction: 'horizontal', type: 'battleship'}),
        new Boat({x: 1, y: 8, direction: 'horizontal', type: 'cruiser'})
      ]});
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

    it "should end the game when the fleet has sunk" do
      find('#cell-0-0').click
      find('#cell-1-0').click

      find('#cell-4-1').click
      find('#cell-5-1').click
      find('#cell-6-1').click
      find('#cell-7-1').click
      find('#cell-8-1').click

      find('#cell-2-3').click
      find('#cell-2-4').click
      find('#cell-2-5').click

      find('#cell-4-5').click
      find('#cell-5-5').click
      find('#cell-6-5').click
      find('#cell-7-5').click

      find('#cell-1-8').click
      find('#cell-2-8').click
      find('#cell-3-8').click
      find('#cell-4-8').click

      assert_counters(22, 2, "€ 1.070.000")
      find("#endGameResult").should have_content("You win! You made € 670.000")
    end

  end

  def assert_counters(total_shots_remaining, shots_remaining_for_iteration, funds)
    find('#totalShotsRemaining').should have_content(total_shots_remaining.to_s)
    find('#shotsRemainingForIteration').should have_content(shots_remaining_for_iteration.to_s)
    find('#funds').should have_content(funds)
  end

end