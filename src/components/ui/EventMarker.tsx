import { faMapPin } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Event } from '@/types/events';
import { useFrame } from '@/context/frame';
import { useMode } from '@/context/mode';

export default function EventMarker({ event, frame, isActive }: { event: Event, frame: number, isActive: boolean }) {
    const { setCurrentFrame } = useFrame();
    const { mode } = useMode();

    const colorMarker = {
        hits: 'text-primary',
        lobs: 'text-green-500',
        services: 'text-blue-500',
        checks: 'text-red-500',
        points: 'text-red-500',
        rebonds: 'text-purple-500',
    }

    const delayEvent = mode === 'dev' ? 0 : 1;

    return (
        <button 
            className={`relative transition-all duration-200 ${isActive ? 'scale-125 opacity-100' : 'opacity-50'}`} 
            onClick={() => {
                setCurrentFrame(frame).then(() => {
                    const video = document.querySelector('video');
                    if (video) {
                        const FPS = 25;
                        const timeInSeconds = frame / FPS;
                        video.currentTime = timeInSeconds - delayEvent;
                    }
                });
            }}
        >
            <FontAwesomeIcon 
                icon={faMapPin} 
                className={`${colorMarker[event]} text-lg`}
            />
        </button>
    )
}