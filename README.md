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

3. In the `public/videos` folder, create 1 subfolder per video to be analyzed with the associated json inside as follows :

You should have something like this :
```
public/
    videos/
        match1/
            pipeline.json
            stats.json
            video.mp4
            player1-video.mp4
            player2-video.mp4
            player3-video.mp4
            player4-video.mp4
        match2/
            ...
```

4. Start the development server:
```bash
npm run dev
```

5. Open the browser and go to `http://localhost:3000`

6. Select the video from the list and happy debugging.

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