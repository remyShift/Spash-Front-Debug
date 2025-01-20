import { useEffect, useState } from 'react';
import { PersonTracking } from '@/types/files';
import ServeIcon from '../ui/icons/ServeIcon';
import LobIcon from '../ui/icons/LobIcon';
import BallIcon from '../ui/icons/BallIcon';

interface FeedEvent {
    id: number;
    message: string;
    timestamp: number;
}

interface KillFeedProps {
    currentFrame: number;
    frameData: {
        persontracking?: {
            [key: string]: PersonTracking;
        };
        detection?: string;
    };
}

const MAX_EVENTS = 4;

export default function KillFeed({ currentFrame, frameData }: KillFeedProps) {
    const [events, setEvents] = useState<FeedEvent[]>([]);
    const [containerHeight, setContainerHeight] = useState(0);
    
    useEffect(() => {
        const updateContainerHeight = () => {
            const videoHeight = document.querySelector('video')?.clientHeight || 0;
            setContainerHeight(videoHeight);
        };

        updateContainerHeight();
        window.addEventListener('resize', updateContainerHeight);
        
        return () => window.removeEventListener('resize', updateContainerHeight);
    }, []);
    
    useEffect(() => {
        if (frameData?.persontracking) {
            Object.values(frameData.persontracking).forEach(player => {
                if (player.do_hit) {
                    const newEvent: FeedEvent = {
                        id: Date.now(),
                        message: `Player ${player.id} ${player.hit_type || 'hit'}`,
                        timestamp: currentFrame
                    };
                    
                    setEvents(prev => {
                        const updatedEvents = [newEvent, ...prev].slice(0, MAX_EVENTS);
                        return updatedEvents;
                    });
                }
            });
        }
    }, [currentFrame, frameData]);

    const eventHeight = 40;
    const maxVisibleEvents = Math.min(Math.floor(containerHeight * 0.3 / eventHeight), MAX_EVENTS);

    return (
        <div 
            className="absolute top-1 right-1 z-50 flex flex-col-reverse gap-2 items-center justify-center pointer-events-none"
            style={{ maxHeight: `${maxVisibleEvents * eventHeight}px` }}
        >
            {events.slice(0, maxVisibleEvents).map(event => (
                <div
                    key={event.id}
                    className="bg-black/80 text-white px-4 py-2 rounded-lg animate-slideIn flex justify-center items-center gap-2"
                    style={{ height: `${eventHeight - 8}px` }}
                >
                    <div className="flex items-center gap-2 justify-center">
                        {event.message.includes('lob') ? <LobIcon /> : event.message.includes('service') ? <ServeIcon /> : <BallIcon />}
                        {event.message}
                    </div>
                </div>
            ))}
        </div>
    );
} 