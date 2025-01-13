import Timeline from "./Timeline";
import { EventTimeline } from "@/types/events";

export default function AllTimelines({ events }: { events: EventTimeline }) {
    return (
        <div className="flex flex-col gap-3">
            {Object.keys(events).map((event) => (
                <Timeline key={event} event={event} frames={events[event]} />
            ))}
        </div>
    )
}