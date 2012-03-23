describe('Zeeslag', function() {

  it('should initialize a grid', function() {
    grid = initializeGrid(2, 2);
    expect(grid.length).toEqual(2);
    expect(grid[0].length).toEqual(2);
    expect(grid[1].length).toEqual(2);
  });

  it('should draw an initialized grid', function() {

  });

});