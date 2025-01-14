import Timeline from "./Timeline";
import { EventTimeline, TimelineInterval } from "@/types/events";
import { Event } from "@/types/events";
import TimelineChronology from "./TimelineChronology";

export default function AllTimelines({ events, timeline }: { events: EventTimeline, timeline: TimelineInterval }) {
    return (
        <div className="flex flex-col justify-evenly h-full">
            <TimelineChronology timeline={timeline} />
            {Object.keys(events).map((event) => (
                <Timeline key={event} event={event as Event} framesEvent={events[event]} />
            ))}
        </div>
    )
}