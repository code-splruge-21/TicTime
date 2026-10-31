// Game state and event wiring. Connects game.js (rules) to ui.js (screen).

const state = {
  board: createEmptyBoard(),
  currentPlayer: 'X',
  gameOver: false,
  scores: { X: 0, O: 0, draws: 0 },
  theme: 'light',
  mode: 'pvp',
  size: 3,
  history: [],
  aiPending: false,
  computerTimer: null,
};

// added pvp mode
// In state:
function createHistoryEntry(lastPlayer = null, lastMove = null) {
  return {
    board: [...state.board],
    currentPlayer: state.currentPlayer,
    lastPlayer,
    lastMove,
    gameOver: state.gameOver,
    scores: { ...state.scores },
  };
}

function resetHistory() {
  state.history = [createHistoryEntry()];
  renderHistory();
}

function renderHistory() {
  const listEl = document.getElementById('history-list');
  listEl.innerHTML = '';
  state.history.forEach((step, index) => {
    const item = document.createElement('li');
    const button = document.createElement('button');
    button.className = 'history-item-btn' + (index === state.history.length - 1 ? ' current' : '');
    button.textContent = index === 0
      ? 'Game Start'
      : `Move #${index}: Player ${step.lastPlayer} at (${Math.floor(step.lastMove / state.size) + 1}, ${(step.lastMove % state.size) + 1})`;
    button.disabled = index === state.history.length - 1;
    button.addEventListener('click', () => jumpToMove(index));
    item.appendChild(button);
    listEl.appendChild(item);
  });
}

function clearComputerTimer() {
  if (state.computerTimer !== null) {
    window.clearTimeout(state.computerTimer);
    state.computerTimer = null;
  }
  state.aiPending = false;
}

function jumpToMove(index) {
  clearComputerTimer();
  state.history = state.history.slice(0, index + 1);
  const target = state.history[index];
  state.board = [...target.board];
  state.currentPlayer = target.currentPlayer;
  state.gameOver = target.gameOver;
  state.scores = { ...target.scores };

  renderBoard(state.board);
  renderScores(state.scores);
  renderHistory();
  setBoardLocked(state.gameOver);

  const result = getGameResult(state.board, state.size);
  if (result.status === 'win') {
    highlightWinningCells(result.line);
    setStatus(`Player ${result.winner} wins!`, result.winner);
  } else if (result.status === 'draw') {
    setStatus("It's a draw!", '');
  } else {
    setStatus(`Player ${state.currentPlayer}'s turn`, state.currentPlayer);
    if (state.mode === 'pve' && state.currentPlayer === 'O') {
      queueComputerMove();
    }
  }
}

// added state.board[index] !== null to guard the occupied cell from being re written
// In handleCellClick:
function handleCellClick(index) {
  if (
    state.gameOver
    || state.aiPending
    || !Number.isInteger(index)
    || index < 0
    || index >= state.board.length
    || state.board[index] !== null
  ) return;

  makeMove(index);
  if (!state.gameOver && state.mode === 'pve' && state.currentPlayer === 'O') {
    queueComputerMove();
  }
}

function makeMove(index) {
  if (state.gameOver || state.board[index] !== null) return;

  const player = state.currentPlayer;
  state.board[index] = player;
  renderBoard(state.board);

  const result = getGameResult(state.board, state.size);
  if (result.status === 'win') {
    state.gameOver = true;
    state.scores[result.winner]++;
    highlightWinningCells(result.line);
    setStatus(`Player ${result.winner} wins!`, result.winner);
    setBoardLocked(true);
    renderScores(state.scores);
    launchConfetti();
  } else if (result.status === 'draw') {
    state.gameOver = true;
    setStatus("It's a draw!", '');
    // added state.scores.draw++; renderScores(State.scores)
    state.scores.draws++;
    renderScores(state.scores);
    setBoardLocked(true);
  } else {
    state.currentPlayer = nextPlayer(state.currentPlayer);
    setStatus(`Player ${state.currentPlayer}'s turn`, state.currentPlayer);
  }

  state.history.push(createHistoryEntry(player, index));
  renderHistory();
}

function queueComputerMove() {
  state.aiPending = true;
  setBoardLocked(true);
  state.computerTimer = window.setTimeout(() => {
    state.computerTimer = null;
    state.aiPending = false;
    if (state.gameOver || state.mode !== 'pve' || state.currentPlayer !== 'O') return;

    const index = getBestMove(state.board, state.size);
    if (index !== null) makeMove(index);
    if (!state.gameOver) setBoardLocked(false);
  }, 250);
}

function startNewGame() {
  clearComputerTimer();
  state.board = createEmptyBoard(state.size);
  state.currentPlayer = 'X';
  state.gameOver = false;
  renderBoard(state.board);
  setBoardLocked(false);
  // added setStatus("Player X's turn", 'X'); to set display messqagae from Player wins to who's turn it is
  setStatus("Player X's turn", 'X');
  resetHistory();
}

function toggleTheme() {
  state.theme = state.theme === 'light' ? 'dark' : 'light';
  setTheme(state.theme);
}

// TODO: wire up the "Reset Scores" button (#reset-scores-btn)
//added a function which resets the score upon clicking reset score
function resetScores() {
  state.scores = { X: 0, O: 0, draws: 0 };
  state.history.forEach((entry) => {
    entry.scores = { ...state.scores };
  });
  renderScores(state.scores);
  renderHistory();
}

// Add event listener at bottom of main.js:
document.getElementById('mode-select').addEventListener('change', (event) => {
  state.mode = event.target.value;
  startNewGame();
});

document.getElementById('size-select').addEventListener('change', (event) => {
  const size = Number(event.target.value);
  if (![3, 4, 5].includes(size)) {
    throw new RangeError(`Unsupported board size: ${event.target.value}`);
  }
  state.size = size;
  buildBoard(handleCellClick, state.size);
  startNewGame();
});

// In handleCellClick (record snapshot):
document.getElementById('reset-scores-btn').addEventListener('click', resetScores);
buildBoard(handleCellClick, state.size);
document.getElementById('new-game-btn').addEventListener('click', startNewGame);
document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
renderBoard(state.board);
renderScores(state.scores);
setStatus("Player X's turn", 'X');
// Reset history in startNewGame():
resetHistory();

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js').catch((error) => {
    console.error('TicTime service worker registration failed:', error);
  });
}
