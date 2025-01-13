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

## Installation 🛠️

1. Clone the repository:
```bash
git clone https://github.com/spash-ai/debug-devtool.git
```
2. Install dependencies:
```bash
npm install
```
3. Start the development server:
```bash
npm run dev
```

4. Create a `videos` file in the `public` folder and create 1 subfolder per video to be analyzed with the associated json inside as follows :
```
public/videos/match1/pipeline-stats.json
public/videos/match1/video.mp4
```

5. Select the video from the list and happy debugging.

## Keyboard shortcuts ⌨️

- `Space` : Play/Pause
- `←` : -1 frame
- `→` : +1 frame
- `Shift + ←` : -100 frames
- `Shift + →` : +100 frames
- `P` : Show/Hide players
- `B` : Show/Hide ball
- `A` : Show/Hide zones
- `H` : Show/Hide homography
- `T` : Show/Hide trajectories

## Technologies used 💻

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Zustand
- Font Awesome

## Contributor

Made with ❤️ by [@remyShift](https://github.com/remyShift), during my internship at Spash.