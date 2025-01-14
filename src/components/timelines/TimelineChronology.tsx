import { TimelineInterval } from "@/types/events";

export default function TimelineChronology({ timeline }: { timeline: TimelineInterval }) {
    return (
        <div>
            {Object.keys(timeline).map((event) => (
                <div key={event}>
                    {timeline[event].type}
                </div>
            ))}
        </div>
    )
}
