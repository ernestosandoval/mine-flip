my_dict = {"1": "1", "2": "2", "3": "3", "0": "💣", "X": ""}

const levels = {
  1: [[3, 1, 6], [0, 3, 6], [5, 0, 6], [2, 2, 6], [4, 1, 6]], 
  2: [[1, 3, 7], [6, 0, 7], [3, 2, 7], [0, 4, 7], [5, 1, 7]], 
  3: [[2, 3, 8], [7, 0, 8], [4, 2, 8], [1, 4, 8], [6, 1, 8]], 
  4: [[3, 3, 8], [0, 5, 8], [8, 0, 10], [5, 2, 10], [2, 4, 10]], 
  5: [[7, 1, 10], [4, 3, 10], [1, 5, 10], [9, 0, 10], [6, 2, 10]], 
  6: [[3, 4, 10], [0, 6, 10], [8, 1, 10], [5, 3, 10], [2, 5, 10]], 
  7: [[7, 2, 10], [4, 4, 10], [1, 6, 13], [9, 1, 13], [6, 3, 10]], 
  8: [[0, 7, 10], [8, 2, 10], [5, 4, 10], [2, 6, 10], [7, 3, 10]]
} 

/* 
  fills in grid with coins/mines
  also should return 4 vectors
    for all rows
      the total number of coins
      the total number of mines
    same for all columns
  board[i][j] is 1,2,3, or 0(mine) 
*/
 function createBoard(level = 1) {
  var board = new Array(5)
  for (var i = 0; i < 5; i++) {
    board[i] = new Array(5)
    for (var j = 0; j < 5; j++) {
      board[i][j] = {}
      board[i][j].value = 1  
      board[i][j].string = "X"
    }
  }

  var data = levels[level][Math.floor(Math.random()*5)]

  var spots = new Set();
  while (spots.size < data[0] + data[1] + data[2]) {
    spots.add(Math.floor(Math.random() * 25));
  }
  spots = Array.from(spots)

  var i
  for (i = 0; i < data[0]; i++) {
    board[Math.floor(spots[i]/5)][spots[i]%5].value = 2
  }
  for (; i < data[0] + data[1]; i++) {
    board[Math.floor(spots[i]/5)][spots[i]%5].value = 3
  }
  for (; i < data[0] + data[1] + data[2]; i++) {
    board[Math.floor(spots[i]/5)][spots[i]%5].value = 0
  }

  board.coins_row = new Array(5).fill(0)
  board.coins_col = new Array(5).fill(0)
  board.mines_row = new Array(5).fill(0)
  board.mines_col = new Array(5).fill(0)

  for (i = 0; i < 5; i++) {
    for (j = 0; j < 5; j++) {
      if (board[i][j].value == 0) {
        board.mines_row[i] += 1
        board.mines_col[j] += 1
      } else {
        board.coins_row[i] += board[i][j].value
        board.coins_col[j] += board[i][j].value
      }
    }
  }

  printBoard(board)

  return board
}

function hasWon(board) {
  for (i=0; i < 5; i++) {
    for (j=0; j < 5; j++) {
      if ((board[i][j].value > 1) & (board[i][j].string == "X")) {
        return false
      }
    }
  }
  return true
}

function play(event) {
  r = event.target.dataset.row
  c = event.target.dataset.col
  board[r][c].string = String(board[r][c].value)
  if (board[r][c].value == 0) {
    // flip all cells
    for (i = 0; i < 5; i++) {
      for (j = 0; j < 5; j++) {
        board[i][j].string = String(board[i][j].value)
      }
    }
    window.alert("you lost")
  } else if (hasWon(board)) {
    // flip all cells
    for (i = 0; i < 5; i++) {
      for (j = 0; j < 5; j++) {
        board[i][j].string = String(board[i][j].value)
      }
    }
    window.alert("you won")
  }
  printBoard(board)
}

function printBoard(board) {
  const gridContainer = document.getElementById("board");
  gridContainer.innerHTML = "";

  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.setAttribute("data-row", i);
      cell.setAttribute("data-col", j);

      if (board[i][j].string == "X") {
        cell.addEventListener('click', play);
      }

      cell.textContent = my_dict[board[i][j].string]
      gridContainer.appendChild(cell);
    }

    const coinHintCell = document.createElement("div");
    coinHintCell.classList.add("hint-cell")
    coinHintCell.textContent = String(board.coins_row[i])
    gridContainer.appendChild(coinHintCell);

    const mineHintCell = document.createElement("div");
    mineHintCell.classList.add("hint-cell")
    mineHintCell.textContent = board.mines_row[i]
    gridContainer.appendChild(mineHintCell);

    gridContainer.appendChild(document.createElement("br"));
  }

  for (i = 0; i < 5; i++) {
    const coinHintCell = document.createElement("div");
    coinHintCell.classList.add("hint-cell")
    coinHintCell.textContent = String(board.coins_col[i])
    gridContainer.appendChild(coinHintCell);
  }

  const emptyCell = document.createElement("div");
  emptyCell.classList.add("empty-cell")
  gridContainer.appendChild(emptyCell);
  gridContainer.appendChild(emptyCell.cloneNode(true));

  gridContainer.appendChild(document.createElement("br"));

  for (i = 0; i < 5; i++) {
    const mineHintCell = document.createElement("div");
    mineHintCell.classList.add("hint-cell")
    mineHintCell.textContent = String(board.mines_col[i])
    gridContainer.appendChild(mineHintCell);
  }

  gridContainer.appendChild(emptyCell.cloneNode(true));
  gridContainer.appendChild(emptyCell.cloneNode(true));
}

board = createBoard()

function newGame() {
  board = createBoard(Number(document.getElementById("level").value))
}

newGameButton = document.getElementById("new-game");
newGameButton.addEventListener("click", newGame)