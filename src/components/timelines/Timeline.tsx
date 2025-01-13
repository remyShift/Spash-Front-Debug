import EventMarker from "../ui/EventMarker";
import TimelineControl from "./TimelineControl";

export default function Timeline() {
    return (
        <div className="w-full h-11 bg-lightBackground rounded-lg">
            <div className="flex items-center w-full h-full gap-0">
                <TimelineControl event="Hits" />
                <div className="w-[2px] h-full bg-lighterBackground"></div>

                <div className="flex flex-col gap-0 w-full relative">
                    <div className="absolute z-10 -top-4 left-1/2 -translate-x-1/2 flex gap-24">
                        <EventMarker />
                        <EventMarker />
                        <EventMarker />
                        <EventMarker />
                        <EventMarker />
                        <EventMarker />
                    </div>
                    <div className="w-full h-[3px] bg-lighterBackground"></div>
                    <div className="w-[2px] h-[25px] bg-secondary absolute left-1/2 -top-[10px] -translate-x-1/2"></div>
                    <div className="absolute z-10 -bottom-6 left-1/2 text-white text-sm translate-x-[-50%] text-center">0:00</div>
                    <div className="absolute z-10 -bottom-6 right-2 text-white text-sm">2:30</div>
                </div>
            </div>
        </div>
    )
}
