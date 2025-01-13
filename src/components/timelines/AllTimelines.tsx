import Timeline from "./Timeline";
import { EventTimeline } from "@/types/events";
import { Event } from "@/types/events";

export default function AllTimelines({ events }: { events: EventTimeline }) {
    return (
        <div className="flex flex-col justify-evenly h-full">
            {Object.keys(events).map((event) => (
                <Timeline key={event} event={event as Event} framesEvent={events[event]} />
            ))}
        </div>
    )
}