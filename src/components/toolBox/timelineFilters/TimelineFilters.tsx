import PlayersFilters from "./PlayersFilters";
import EventsFilters from "./EventsFilters";
import PlayFilteredControl from "./PlayFilteredControl";
import { JSONData } from "@/types/files";

export default function TimelineFilters({ jsonData }: { jsonData: JSONData }) {
    return (
        <div className="flex flex-col gap-4 p-4">
            <PlayersFilters />
            <EventsFilters />
            <div className="flex justify-center">
                <PlayFilteredControl jsonData={jsonData} />
            </div>
        </div>
    );
}