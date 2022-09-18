

function getStorageObject(grid) {
    /*  converts arr obj to string
    | 0 0 0 |
    | 1 1 0 | => '0, 0, 0 - 1, 1, 0 - 0, 0, 1'
    | 0 0 1 |
    */
    return grid.map((col) => col.join(",")).join("-");
}

function parseBoard(str) {
    /*  converts string to arr.
    | 0 0 0 |
    | 1 1 0 | <= '0, 0, 0 - 1, 1, 0 - 0, 0, 1'
    | 0 0 1 |
    */
    let cols = str.split("-");
    // string to Grid
    let arr = cols.map((col) => col.split(",").map((ele) => parseInt(ele)));
    return arr;
}

function getKey(rows, cols) {
    return `${rows}-${cols}`;
}

