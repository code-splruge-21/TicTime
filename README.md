# TicTime ⏱️❌⭕

A colourful, animated Tic-Tac-Toe game built with plain **HTML, CSS and JavaScript**. No frameworks, no build step, no installs.

> 🎯 **Hack Day project.** TicTime is *deliberately incomplete*: a few things are broken and a few features are missing. Each one is an issue waiting for you. See [CONTRIBUTING.md](CONTRIBUTING.md) to get started.

## Screenshots

_Coming soon._

## Run it

You only need a browser.

```bash
git clone <your-fork-url>
cd TicTime
```

Serve the folder locally to use all features, including installing TicTime and playing offline. Service workers do not run when opening `index.html` directly from the file system.

```bash
python3 -m http.server 8000
```

Open [http://localhost:8000](http://localhost:8000). The first visit caches the app files; after that, TicTime can be loaded and played offline. The font uses local system fallbacks, so it does not need a network connection.

## Install and test offline

1. Open TicTime at `http://localhost:8000` in a browser that supports installable web apps.
2. Use the browser's **Install app** button or menu to install TicTime.
3. In DevTools, open **Application** → **Manifest** to check the app details and icons, then **Service Workers** to confirm the worker is activated.
4. Open **Application** → **Service Workers**, enable **Offline**, and reload the page. The game should load and remain playable.

Service workers require a secure context: `localhost` is supported for local testing, and deployed sites should use HTTPS.

## How to play

1. Player **X** goes first, then players take turns clicking an empty square.
2. Get three of your marks in a row (across, down or diagonally) to win.
3. If all nine squares fill up with no winner, it's a draw.
4. **New Game** clears the board; the scoreboard keeps counting.

## Project structure

```
TicTime/
├── index.html        # page layout
├── css/styles.css    # all styling and animations
└── js/
    ├── game.js       # rules: win/draw detection (no DOM code)
    ├── ui.js         # drawing the board, scores, theme, confetti
    └── main.js       # game state + event handlers
```

## Contributing

Read [CONTRIBUTING.md](CONTRIBUTING.md). Pick an issue labelled `documentation`, `beginner` or `hard`, fix it, and open a pull request.

## License

[MIT](LICENSE)
