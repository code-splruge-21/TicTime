# TicTime ⏱️❌⭕

A colourful, animated Tic-Tac-Toe game built with plain **HTML, CSS and JavaScript**. No frameworks or build step are needed.

## Screenshots

These project previews show a game in progress, a win with all three winning squares highlighted, and the dark theme.

![TicTime game in progress with X and O marks, scores, controls, and move history](docs/screenshot.svg)

![TicTime win with the three winning squares highlighted in purple](docs/screenshot-win.svg)

![TicTime in dark mode with dark scoreboard, status pill, and board](docs/screenshot-dark.svg)

## Run it

You only need a browser.

```bash
git clone <your-fork-url>
cd TicTimePro
```

Open `index.html` directly, or serve the folder to use install/offline support:

```bash
python3 -m http.server 8000     # then open http://localhost:8000
# or: npx serve
```

## How to play

1. Player **X** goes first, then players take turns choosing an empty square.
2. Get a complete row, column or diagonal to win. On larger boards, the line matches the board size.
3. Choose two players or play as X against the computer.
4. **New Game** clears the board; the scoreboard keeps counting. **Reset Scores** clears it.
5. Select a move in the history panel to review an earlier position.

## Troubleshooting & FAQ

**Why can't I install the app?** Serve it from localhost or HTTPS. Browsers do not support service workers on a `file://` page.

**How do I use the offline version?** Open the app online once from localhost or HTTPS. The service worker caches the app files for later visits.

**Can the computer lose?** On a 3×3 board its minimax search prevents a loss. The larger boards use immediate win/block checks and are not guaranteed unbeatable.

**How do I run the automated tests?** Install Node.js 20 or later and run `node --test` from the project root.

## Project structure

```
TicTimePro/
├── index.html        # page layout and controls
├── css/styles.css    # styling and animations
├── manifest.json     # installable app metadata
├── sw.js             # offline asset cache
├── js/
│   ├── game.js       # rules and computer move selection
│   ├── ui.js         # board, scores, theme and history rendering
│   └── main.js       # game state and event handlers
├── tests/game.test.js
└── docs/ARCHITECTURE.md
```

## Contributing

Read [CONTRIBUTING.md](CONTRIBUTING.md). Run `node --test` before opening a pull request.

## License

[MIT](LICENSE)
