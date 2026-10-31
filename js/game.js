// Game rules for TicTime. No DOM code lives here.
//fixed in [2,4,7] to [2,4,6] to fix diagonal win detection
const WIN_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

function createEmptyBoard(size = 3) {
  return Array(size * size).fill(null);
}

function nextPlayer(player) {
  return player === 'X' ? 'O' : 'X';
}

function getWinningLines(size) {
  if (size === 3) return WIN_LINES;

  const lines = [];
  for (let row = 0; row < size; row++) {
    lines.push(Array.from({ length: size }, (_, column) => row * size + column));
  }
  for (let column = 0; column < size; column++) {
    lines.push(Array.from({ length: size }, (_, row) => row * size + column));
  }
  lines.push(Array.from({ length: size }, (_, index) => index * size + index));
  lines.push(Array.from({ length: size }, (_, index) => index * size + size - index - 1));
  return lines;
}

//fixed In getGameResult(), the full-board check runs before checking if someone has won. If move 9 makes 3-in-a-row, it triggers draw early.
function getGameResult(board, size = Math.sqrt(board.length)) {
  for (const line of getWinningLines(size)) {
    const [first, ...rest] = line;
    if (board[first] && rest.every((index) => board[index] === board[first])) {
      return { status: 'win', winner: board[first], line };
    }
  }
  if (board.every((cell) => cell !== null)) {
    return { status: 'draw', winner: null, line: null };
  }
  return { status: 'playing', winner: null, line: null };
}

function getAvailableMoves(board) {
  return board
    .map((val, idx) => (val === null ? idx : null))
    .filter((idx) => idx !== null);
}

// added minmax logic to get the best move for the computer player (O) using the minimax algorithm. The function recursively evaluates all possible moves and their outcomes, returning the best move for the computer player.
function evaluateBoard(board, size) {
  let score = 0;
  for (const line of getWinningLines(size)) {
    let xCount = 0;
    let oCount = 0;
    for (const index of line) {
      if (board[index] === 'X') xCount++;
      if (board[index] === 'O') oCount++;
    }
    if (xCount === 0) score += 10 ** oCount;
    if (oCount === 0) score -= 10 ** xCount;
  }
  return score;
}

function minimax(board, player, depth = 0, size = Math.sqrt(board.length)) {
  const result = getGameResult(board, size);
  if (result.status === 'win') {
    return { score: result.winner === 'O' ? 10 - depth : depth - 10 };
  }
  if (result.status === 'draw') {
    return { score: 0 };
  }

  if (size > 3 && depth >= 2) {
    return { score: evaluateBoard(board, size) };
  }

  let bestIndex = null;
  let bestScore = player === 'O' ? -Infinity : Infinity;
  const availableMoves = getAvailableMoves(board);

  for (const index of availableMoves) {
    board[index] = player;
    const score = minimax(board, nextPlayer(player), depth + 1, size).score;
    board[index] = null;
    if ((player === 'O' && score > bestScore) || (player === 'X' && score < bestScore)) {
      bestIndex = index;
      bestScore = score;
    }
  }
  return { index: bestIndex, score: bestScore };
}

function getBestMove(board, size = Math.sqrt(board.length)) {
  if (getGameResult(board, size).status !== 'playing') return null;
  return minimax(board, 'O', 0, size).index;
}