import { faBackward, faBackwardStep, faForward, faForwardStep, faPause, faPlay } from '@fortawesome/free-solid-svg-icons'
import React from 'react'
import ControlBtn from './ControlBtn';

interface ToolBoxControlsProps {
    handleFrameChange: (frame: number) => void;
    currentFrame: number;
    isVideoPlaying: boolean;
    togglePlay: () => void;
}

export default function ToolBoxControls({ handleFrameChange, currentFrame, isVideoPlaying, togglePlay }: ToolBoxControlsProps) {
    return (
        <div className="flex gap-4 items-center justify-center">
            <ControlBtn icon={faBackward} onClick={() => handleFrameChange(currentFrame - 100)} text="-100" />
            <ControlBtn icon={faBackwardStep} onClick={() => handleFrameChange(currentFrame - 1)} text="-1" />
            <ControlBtn icon={isVideoPlaying ? faPause : faPlay} onClick={togglePlay} text={isVideoPlaying ? "Pause" : "Play"} />
            <ControlBtn icon={faForwardStep} onClick={() => handleFrameChange(currentFrame + 1)} text="+1" />
            <ControlBtn icon={faForward} onClick={() => handleFrameChange(currentFrame + 100)} text="+100" />
        </div>
)
}
