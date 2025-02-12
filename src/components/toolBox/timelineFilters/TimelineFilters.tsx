import PlayersFilters from "./PlayersFilters";
import EventsFilters from "./EventsFilters";
import ControlBtn from "../toolboxControls/ControlBtn";
import { faPause, faPlay } from "@fortawesome/free-solid-svg-icons";
import { useVideoPlayer } from "@/hooks/useVideoPlayer";

export default function TimelineFilters() {
    const { isVideoPlaying } = useVideoPlayer();

    return (
        <div className="flex flex-col gap-4 p-4">
            <PlayersFilters />
            <EventsFilters />
            {/* <ControlBtn icon={isVideoPlaying ? faPause : faPlay} onClick={togglePlay} text={isVideoPlaying ? "Pause" : "Play"} /> */}
        </div>
    );
}