# Spash Debug Devtool 🎥

A debugging tool for Spash developers to analyze AI results on videos.

## Features 🚀

- Video visualization with playback controls
- Real-time AI data display:
- Player detection
- Ball tracking
- Game zones
- Homography
- Trajectories
- Interactive timeline with event markers
- Frame-by-frame navigation
- Keyboard shortcuts for efficient use
- Real time homography edit

## Installation 🛠️

1. Clone the repository:
```bash
git clone https://github.com/spash-ai/debug-devtool.git
```
2. Create docker image :
```bash
docker compose build
```

3. Start the app :
```bash
docker compose up -d
```

4. Happy debugging !

## Keyboard shortcuts ⌨️

- `Space` : Play/Pause
- `←` : -1 frame
- `→` : +1 frame
- `Shift + ←` : -100 frames
- `Shift + →` : +100 frames
- `P` : Show/Hide players
- `B` : Show/Hide ball
- `A` : Show/Hide Team A Zones
- `C` : Show/Hide Team C Zones
- `H` : Show/Hide homography
- `T` : Show/Hide trajectories
- `O` : Show/Hide Homography
- `Shift + P` : Toggle advanced mode

## Technologies used 💻

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Zustand
- Font Awesome

## Contributor

Made with ❤️ by [@remyShift](https://github.com/remyShift), during my internship at Spash.
