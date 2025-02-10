import { useFrame } from '@/context/frame';
import { JSONData } from '@/types/files'
import { useEffect, useState } from 'react';
import FrameHeader from './FrameHeader';
import EventsSection from './EventsSection';
import InfosSection from './InfosSection';
import BallSection from './BallSection';
import PadelPlayersSection from './PadelPlayersSection';
import PerformanceSection from './PerformanceSection';
import { useSport } from '@/context/sport';
import FootballPlayersSection from './FootballPlayersSection';

interface FrameInfosProps {
    framesData: JSONData['data'];
    events: JSONData['events'];
}

export default function FrameInfos({ framesData, events }: FrameInfosProps) {
    const { currentFrame } = useFrame();
    const { currentSport } = useSport();
    const [frameData, setFrameData] = useState<JSONData['data'][number] | null>(null);

    useEffect(() => {
        if (!framesData || !currentFrame) return;
        setFrameData(framesData[currentFrame]);
    }, [framesData, currentFrame]);

    return (
        <div className='p-4 flex flex-col gap-8 max-h-[500px] overflow-y-auto'>
            <FrameHeader currentFrame={currentFrame} frameData={frameData} />
            <PerformanceSection />
            {events && <EventsSection events={events} currentFrame={currentFrame} />}
            <InfosSection frameData={frameData} />
            <BallSection frameData={frameData} />
            {currentSport === "padel" && <PadelPlayersSection frameData={frameData} />}
            {currentSport === "foot" && <FootballPlayersSection frameData={frameData} />}
        </div>
    )
} 