import TimelineControl from "./TimelineControl";

export default function Timeline() {
    return (
        <div className="w-full h-12 bg-lightBackground rounded-2xl">
            <div className="flex items-center w-full h-full gap-0">
                <TimelineControl event="Hits" />
                <div className="w-[2px] h-full bg-tertiary"></div>
            </div>
        </div>
    )
}
