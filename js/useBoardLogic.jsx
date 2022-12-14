const { useState, useCallback, useRef } = React;

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return { width, height };
}

const GRID_CELL_TYPES = {
  WALL: -1,
  VISITED: -2,
  EMPTY: 0,
  START: 1,
  END: 2,
};

const boxSize = 20;
const { width, height } = getWindowDimensions();
const paddingSize = 5;
const numRows = parseInt((height - 5 * boxSize) / (boxSize + paddingSize));
const numCols = parseInt((width - 5 * boxSize) / (boxSize + paddingSize));

function useBoardState() {
  const [grid, setGrid] = useState(getEmptyBoard(numRows, numCols));
  const currGrid = useRef(grid);
  currGrid.current = grid;
  const setGridState = (val) => {
    setGrid(val);
    currGrid.current = grid;
  };

  const [emptyCellColor, setEmptyCellColor] = useState("grey");

  const [running, setRunning] = useState(false);
  const runningRef = useRef(running);
  runningRef.current = running;

  const setRunningState = (val) => {
    setRunning(val);
    runningRef.current = val;
  };

  const updateTime = 500;

  const runSimulation = useCallback(() => {
    if (!runningRef.current) return;
    // getting the next generation arr
    let tempArr = getNextGen(currGrid.current);

    if (tempArr === false) {
      // no path found
      setRunningState(false);
      alert("No path found");
      return;
    } else if (tempArr === true) {
      // path found
      setRunningState(false);
      alert("Path Sucessfully found !");
      return;
    }

    setGridState(tempArr);

    setTimeout(() => {
      runSimulation();
    }, updateTime);
  }, []);

  function toggleStart() {
    setRunningState(!running);
    runSimulation();
  }

  function resetBoard() {
    DFSstack = [[0, 0]];
    setRunningState(false);
    setGridState(getEmptyBoard(numRows, numCols));
  }

  function loadBoard() {
    resetBoard();
    const key = "board" + getKey(numRows, numCols);
    if (!(key in localStorage)) {
      alert("No board stored with current dimensions ");
      return;
    }
    const board = localStorage.getItem(key);
    let grid = parseBoard(board);
    setGridState(grid);
  }

  function generateRandomBoard() {
    resetBoard();
    const emptyBoard = getEmptyBoard(numRows, numCols);
    const randMaze = generateMaze(emptyBoard, 0, 0, numRows - 1, numCols - 1);
    console.log(randMaze.length, randMaze[0].length);
    // log the total length of the board
    console.log(randMaze.flat().length);
    setGridState(randMaze);
  }

  function saveBoard() {
    try {
      let key = getKey(numRows, numCols);
      localStorage.setItem("board" + key, getStorageObject(grid));
      alert("Sucessfully saved!");
    } catch (e) {
      console.log(e);
      alert("Failed to save the board");
    }
  }

  function hideMaze() {
    if (emptyCellColor === "grey") {
      setEmptyCellColor("black");
    } else {
      setEmptyCellColor("grey");
    }
  }

  function handleOnCellClick(row, col) {
    if (running) return;

    let tempGrid = [...grid];
    if (tempGrid[row][col] === GRID_CELL_TYPES.EMPTY) {
      tempGrid[row][col] = GRID_CELL_TYPES.WALL;
    } else if (tempGrid[row][col] === GRID_CELL_TYPES.WALL) {
      tempGrid[row][col] = GRID_CELL_TYPES.EMPTY;
    }
    setGridState(tempGrid);
  }

  function getColor(type) {
    switch (type) {
      case GRID_CELL_TYPES.WALL:
        return "black";
      case GRID_CELL_TYPES.VISITED:
        return "cyan";
      case GRID_CELL_TYPES.EMPTY:
        return emptyCellColor;
      case GRID_CELL_TYPES.START:
        return "blue";
      case GRID_CELL_TYPES.END:
        return "red";
      default:
        return "white";
    }
  }

  return {
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
    getColor,
    running,
    emptyCellColor,
  };
}

const SHORT_STEP_NEIGHBOURS = [
  (row, col) => [row, col - 1],
  (row, col) => [row, col + 1],
  (row, col) => [row - 1, col],
  (row, col) => [row + 1, col],
];

const LONG_STEP_NEIGHBOURS = [
  (row, col) => [row, col - 2],
  (row, col) => [row, col + 2],
  (row, col) => [row - 2, col],
  (row, col) => [row + 2, col],
];

function getNeighbours(grid, i, j) {
  let neighbours = [];
  for (let k = 0; k < SHORT_STEP_NEIGHBOURS.length; k++) {
    const [x, y] = SHORT_STEP_NEIGHBOURS[k](i, j);

    const isEmptyOrEnd = (i, j) =>
      grid[i][j] == GRID_CELL_TYPES.EMPTY || grid[i][j] == GRID_CELL_TYPES.END;
    const isValidCell = (i, j) => inBounds(i, j) && isEmptyOrEnd(i, j);

    if (isValidCell(x, y)) {
      neighbours.push([x, y]);
    }
  }
  return neighbours;
}

let DFSstack = [[0, 0]];
function getNextGen(grid) {
  // returns the next iteration of dfs
  if (DFSstack.length == 0) return false;
  let tempArr = getCopy(grid);
  const isEnd = (i, j) => grid[i][j] == GRID_CELL_TYPES.END;
  let [i, j] = DFSstack.pop();
  const neighbours = getNeighbours(grid, i, j);
  for (let k = 0; k < neighbours.length; k++) {
    const [x, y] = neighbours[k];
    if (isEnd(x, y)) return true;
    tempArr[x][y] = GRID_CELL_TYPES.VISITED;
    DFSstack.push([x, y]);
  }

  return tempArr;
}

function createWalk(grid, row, col) {
  let getIdxFnLst = LONG_STEP_NEIGHBOURS.slice();
  getIdxFnLst = shuffle(getIdxFnLst);

  const isEmpty = (i, j) => grid[i][j] == GRID_CELL_TYPES.EMPTY;
  const isValidCell = (i, j) => inBounds(i, j) && isEmpty(i, j);

  for (let [i, idxFn] of getIdxFnLst.entries()) {
    let [newRow, newCol] = idxFn(row, col);
    if (isValidCell(newRow, newCol)) {
      grid[newRow][newCol] = GRID_CELL_TYPES.WALL;
      let [x, y] = SHORT_STEP_NEIGHBOURS[i](newRow, newCol);
      if (isValidCell(x, y)) grid[x][y] = GRID_CELL_TYPES.WALL;
      return [newRow, newCol];
    }
  }
  return [null, null];
}

function createBacktrack(grid, stack) {
  const isEmpty = (i, j) => grid[i][j] == GRID_CELL_TYPES.EMPTY;
  while (stack.length > 0) {
    let [x, y] = stack.pop();
    for (let [i, idxFn] of LONG_STEP_NEIGHBOURS.entries()) {
      let [newRow, newCol] = idxFn(x, y);
      if (inBounds(newRow, newCol) && isEmpty(newRow, newCol)) {
        return [newRow, newCol];
      }
    }
  }
}

function generateMaze(grid, start_x, start_y, end_x, end_y) {
  grid[start_x][start_y] = GRID_CELL_TYPES.START;
  grid[end_x][end_y] = GRID_CELL_TYPES.END;

  const stack = [];
  const rows = grid.length;
  const cols = grid[0].length;

  let x = randInt(0, rows - 1);
  let y = randInt(0, cols - 1);
  grid[x][y] = GRID_CELL_TYPES.WALL;

  while (x !== null && y !== null) {
    while (x !== null && y !== null) {
      stack.push([x, y]);
      try {
        [x, y] = createWalk(grid, x, y);
      } catch (e) {
        console.log(e);
        console.log({ x, y });
      }
    }

    try {
      [x, y] = createBacktrack(grid, stack);
    } catch (e) {
      console.log(e);
      console.log({ x, y });
    }
  }
  return grid;
}
