import { JSONData } from "@/types/files";

interface EventsSectionProps {
    events: JSONData['events'];
    currentFrame: number;
}

export default function EventsSection({ events, currentFrame }: EventsSectionProps) {
    return (
        <div className='flex flex-col gap-4'>
            <p className='text-white font-semibold text-center text-lg'>- - - - - Events - - - - -</p>
            <div className='flex gap-4 flex-wrap justify-center'>
                {Object.keys(events).map((event) => (
                    <span 
                        key={event} 
                        className={`font-normal ${events[event].includes(currentFrame) ? 'text-primary font-bold' : 'text-white'}`}
                    >
                        {event.charAt(0).toUpperCase() + event.slice(1)}
                    </span>
                ))}
            </div>
        </div>
    )
} 