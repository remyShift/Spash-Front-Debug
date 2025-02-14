import CheckBox from '@/components/ui/CheckBox'
import { useEventsFilters } from '@/context/eventsFilters';

export default function EventsFilters() {
    const { eventsFilters, setEventsFilters } = useEventsFilters();

    const handleEventFilterChange = (event: string) => {
        if (eventsFilters.includes(event)) {
            setEventsFilters(eventsFilters.filter((e) => e !== event));
        } else {
            setEventsFilters([...eventsFilters, event]);
        }
    }

    return (
        <div className="flex flex-col gap-2">
            <p className='text-white font-semibold text-center text-lg'>- - - - - Events - - - - -</p>
            <div className="flex gap-24 justify-center items-center">
                <div className="flex flex-col gap-2">
                    <CheckBox 
                        label="Hits" 
                        onChange={() => handleEventFilterChange("hits")} 
                        checked={eventsFilters.includes("hits")}
                    />
                    <CheckBox 
                        label="Services" 
                        onChange={() => handleEventFilterChange("services")} 
                        checked={eventsFilters.includes("services")}
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <CheckBox 
                        label="Lobs" 
                        onChange={() => handleEventFilterChange("lobs")} 
                        checked={eventsFilters.includes("lobs")}
                    />
                    <CheckBox 
                        label="Checks" 
                        onChange={() => handleEventFilterChange("checks")} 
                        checked={eventsFilters.includes("checks")}
                    />
                </div>
            </div>
        </div>
    )
}
