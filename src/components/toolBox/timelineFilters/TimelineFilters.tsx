import PlayersFilters from "./PlayersFilters";
import EventsFilters from "./EventsFilters";

export default function TimelineFilters() {
    return (
        <div className="flex flex-col gap-4 p-4">
            <PlayersFilters />
            <EventsFilters />
        </div>
    );
}