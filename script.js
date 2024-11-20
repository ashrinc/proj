const board = document.getElementById('sudoku-board');

function createBoard() {
    board.innerHTML = '';
    for (let i = 0; i < 81; i++) {
        const cell = document.createElement('input');
        cell.type = 'number';
        cell.className = 'cell';
        cell.maxLength = 1;
        cell.setAttribute('min', '1');
        cell.setAttribute('max', '9');
        cell.addEventListener('input', function () {
            if (this.value > 9) this.value = 9;
            if (this.value < 1) {
                this.value = '';
                clearWarning();
                return;
            }
            if (!isValidInput(this.value, i)) {
                alert("Invalid input!");
                this.value = '';
            } else {
                clearWarning();
            }
        });
        board.appendChild(cell);
    }
}

function isValidInput(value, index) {
    const cells = Array.from(board.getElementsByClassName('cell'));
    const row = Math.floor(index / 9);
    const col = index % 9;

    for (let i = 0; i < 9; i++) {
        if (cells[row * 9 + i].value === value && row * 9 + i !== index) return false;
        if (cells[i * 9 + col].value === value && i * 9 + col !== index) return false;
    }

    const boxRowStart = Math.floor(row / 3) * 3;
    const boxColStart = Math.floor(col / 3) * 3;

    for (let r = boxRowStart; r < boxRowStart + 3; r++) {
        for (let c = boxColStart; c < boxColStart + 3; c++) {
            const cellIndex = r * 9 + c;
            if (cells[cellIndex].value === value && cellIndex !== index) return false;
        }
    }

    return true;
}

function clearWarning() {}

function generateSudoku() {
    const grid = Array.from({ length: 81 }, () => 0);
    fillGrid(grid);

    const difficulty = document.getElementById('difficulty').value;
    let removeCount;

    switch (difficulty) {
        case 'easy':
            removeCount = Math.floor(Math.random() * (40 - 36 + 1)) + 36;
            break;
        case 'medium':
            removeCount = Math.floor(Math.random() * (35 - 30 + 1)) + 30;
            break;
        case 'hard':
            removeCount = Math.floor(Math.random() * (30 - 25 + 1)) + 25;
            break;
    }

    removeNumbers(grid, removeCount);
    const cells = Array.from(board.getElementsByClassName('cell'));

    for (let i = 0; i < grid.length; i++) {
        cells[i].value = grid[i] === 0 ? '' : grid[i];
        if (grid[i] !== 0) {
            cells[i].classList.add('filled');
            cells[i].disabled = true;
        } else {
            cells[i].disabled = false;
        }
    }
}

function fillGrid(grid) {
    for (let i = 0; i < 81; i++) {
        if (grid[i] === 0) {
            const row = Math.floor(i / 9);
            const col = i % 9;

            const nums = shuffleArray([...Array(9).keys()].map(n => n + 1));

            for (const num of nums) {
                if (isValid(grid, num, row, col)) {
                    grid[i] = num;
                    if (fillGrid(grid)) return true;
                    grid[i] = 0;
                }
            }
            return false;
        }
    }
    return true;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function removeNumbers(grid, count) {
    let removedCount = 0;

    while (removedCount < count) {
        const index = Math.floor(Math.random() * 81);
        if (grid[index] !== 0) {
            grid[index] = 0;
            removedCount++;
        }
    }
}

function solveSudoku() {
    const cells = Array.from(board.getElementsByClassName('cell'));
    const grid = cells.map(cell => (cell.value ? parseInt(cell.value) : 0));

    if (solve(grid)) {
        for (let i = 0; i < grid.length; i++) {
            cells[i].value = grid[i] === 0 ? '' : grid[i];
        }
    } else {
        alert("No solution exists!");
    }
}

function solve(grid) {
    const emptySpot = findEmpty(grid);
    if (!emptySpot) return true;

    const [row, col] = emptySpot;

    for (let num = 1; num <= 9; num++) {
        if (isValid(grid, num, row, col)) {
            grid[row * 9 + col] = num;
            if (solve(grid)) return true;
            grid[row * 9 + col] = 0;
        }
    }

    return false;
}

function findEmpty(grid) {
    for (let i = 0; i < grid.length; i++) {
        if (grid[i] === 0) return [Math.floor(i / 9), i % 9];
    }
    return null;
}

function isValid(grid, num, row, col) {
    for (let i = 0; i < 9; i++) {
        if (grid[row * 9 + i] === num || grid[i * 9 + col] === num) return false;
    }

    const boxRowStart = Math.floor(row / 3) * 3;
    const boxColStart = Math.floor(col / 3) * 3;

    for (let r = boxRowStart; r < boxRowStart + 3; r++) {
        for (let c = boxColStart; c < boxColStart + 3; c++) {
            if (grid[r * 9 + c] === num) return false;
        }
    }

    return true;
}

function clearBoard() {
    const cells = Array.from(board.getElementsByClassName('cell'));
    cells.forEach(cell => cell.value = '');
}

document.getElementById('generate-button').addEventListener('click', generateSudoku);
document.getElementById('solve-button').addEventListener('click', solveSudoku);
document.getElementById('clear-button').addEventListener('click', clearBoard);

createBoard();
