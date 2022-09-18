function Board() {
  const {
    grid,
    numCols,
    boxSize,
    resetBoard,
    handleOnCellClick,
    loadBoard,
    saveBoard,
    hideMaze,
    toggleStart,
    generateRandomBoard,
    running,
    emptyCellColor,
    getColor, 
  } = useBoardState();

  return (
    <>
      <div id="settings">
        <button title="Resets the entire board" onClick={resetBoard}>
          <Clear />
        </button>
        <button
          title="Generates a random maze with a start and end"
          onClick={generateRandomBoard}
        >
          <Random />
        </button>
        <button
          title="Toggles the solving of the maze"
          style={{
            color: running ? "grey" : "green",
          }}
          onClick={toggleStart}
        >
          {running ? <Pause /> : <Play />}
        </button>
        <button
          title="Hide the cells of grey color i.e empty cells"
          onClick={hideMaze}
        >
          {emptyCellColor === "grey" ? <EyeSlash /> : <Eye />}
        </button>
        <button
          title="Saves the current board to local storage"
          onClick={saveBoard}
        >
          <Save />
        </button>
        <button title="Loads the board from local storage" onClick={loadBoard}>
          <Load />
        </button>
      </div>
      <div
        className="board"
        style={{
          gridTemplateColumns: `repeat(${numCols}, ${boxSize}px)`,
        }}
      >
        {grid.map((row, i) =>
          row.map((cellType, j) => (
            <div
              onClick={() => handleOnCellClick(i, j)}
              className="board-ele"
              key={`${i}-${j}`}
              style={{
                width: boxSize,
                height: boxSize,
                backgroundColor: getColor(cellType),
              }}
            ></div>
          ))
        )}
      </div>
    </>
  );
}
