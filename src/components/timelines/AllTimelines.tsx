import Timeline from "./Timeline";
import { EventTimeline, TimelineInterval } from "@/types/events";
import { Event } from "@/types/events";
import TimelineChronology from "./TimelineChronology";
import { JSONData } from "@/types/files";

export default function AllTimelines({ events, timeline, jsonData }: { events: EventTimeline, timeline: TimelineInterval[], jsonData: JSONData["data"] }) {
    return (
        <div className="flex flex-col gap-2 justify-evenly h-full">
            <TimelineChronology timeline={timeline} jsonData={jsonData} />
            {Object.keys(events).map((event) => (
                <Timeline key={event} event={event as Event} framesEvent={events[event]} />
            ))}
        </div>
    )
}