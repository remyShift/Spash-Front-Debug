import { faMapPin } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Event } from '@/types/events';

export default function EventMarker({ event }: { event: Event }) {
    const colorMarker = {
        hits: 'text-primary',
        lobs: 'text-green-500',
        services: 'text-blue-500',
        checks: 'text-yellow-500',
        points: 'text-red-500',
        rebonds: 'text-purple-500',
    }

    return (
        <FontAwesomeIcon icon={faMapPin} className={`${colorMarker[event]} text-lg`}/>
    )
}