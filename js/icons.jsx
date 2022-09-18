function Pause() {
  return <i className="fa-solid fa-pause"></i>;
}
function Play() {
  return <i className="fa-solid fa-play"></i>;
}

function Eye() {
  return <i className="fa-solid fa-eye"></i>;
}

function EyeSlash() {
  return <i className="fa-solid fa-eye-slash"></i>;
}

function Random() {
  return <i className="fa-solid fa-random"></i>;
}

function Clear() {
  return <i className="fa-solid fa-trash"></i>;
}

function Save() {
  return <i className="fa-solid fa-save"></i>;
}

function Load() {
  return <i className="fa-solid fa-upload"></i>;
}

function inBounds(row, col) {
  return row >= 0 && row < numRows && col >= 0 && col < numCols;
}
