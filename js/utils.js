function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function toBool(a) {
    if (a == false || a == "false") {
        return false;
    }
    return true;
}

function getCopy(arr) {
    // returns a copy of the  arr
    return arr.map((row) => {
        return row.slice();
    });
}


function randChoice(arr) {
    return arr[randInt(0, arr.length - 1)];
}

function shuffle(arr) {
    let newArr = arr.slice();
    for (let i = newArr.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
}

function getEmptyBoard(rows, cols) {
    // Creates  a 2D board filled  with 0's
    let returnArr = [];
    for (let i = 0; i < rows; i++) {
        returnArr.push(Array.from(Array(cols), () => 0));
    }
    return returnArr;
}

