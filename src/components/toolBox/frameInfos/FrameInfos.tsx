import { useFrame } from '@/context/frame';
import { JSONData } from '@/types/files'
import { useEffect, useState } from 'react';
import FrameHeader from './FrameHeader';
import EventsSection from './EventsSection';
import InfosSection from './InfosSection';
import BallSection from './BallSection';
import PlayersSection from './PlayersSection';
import PerformanceSection from './PerformanceSection';

interface FrameInfosProps {
    framesData: JSONData['data'];
    events: JSONData['events'];
}

export default function FrameInfos({ framesData, events }: FrameInfosProps) {
    const { currentFrame } = useFrame();
    const [frameData, setFrameData] = useState<JSONData['data'][number] | null>(null);

    useEffect(() => {
        setFrameData(framesData[currentFrame]);
    }, [framesData, currentFrame]);

    return (
        <div className='p-4 flex flex-col gap-8 max-h-[500px] overflow-y-auto'>
            <FrameHeader currentFrame={currentFrame} frameData={frameData} />
            <PerformanceSection />
            <EventsSection events={events} currentFrame={currentFrame} />
            <InfosSection frameData={frameData} />
            <BallSection frameData={frameData} />
            <PlayersSection 
                frameData={frameData} 
            />
        </div>
    )
} 