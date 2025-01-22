import { useFrame } from '@/context/frame';
import { JSONData } from '@/types/files'
import { useEffect, useState } from 'react';
import { countPlayerHits } from '@/utils/countPlayerHits';
import FrameHeader from './FrameHeader';
import EventsSection from './EventsSection';
import InfosSection from './InfosSection';
import BallSection from './BallSection';
import PlayersSection from './PlayersSection';

export default function FrameInfos({ framesData, events }: { 
    framesData: JSONData['data'], 
    events: JSONData['events'] 
}) {
    const { currentFrame } = useFrame();
    const [frameData, setFrameData] = useState<JSONData['data'][number] | null>(null);
    const [playerHits, setPlayerHits] = useState<{[key: string]: number}>({});

    useEffect(() => {
        setFrameData(framesData[currentFrame]);

        const hits: {[key: string]: number} = {};
        Object.keys(framesData[currentFrame]?.persontracking || {}).forEach((playerId) => {
            if (framesData[currentFrame]?.persontracking) {
                const player = framesData[currentFrame].persontracking[playerId];
                hits[playerId] = countPlayerHits(framesData, player.id, currentFrame);
            }
        });
        setPlayerHits(hits);
    }, [framesData, currentFrame]);

    return (
        <div className='p-4 flex flex-col gap-8 max-h-[500px] overflow-y-auto'>
            <FrameHeader currentFrame={currentFrame} frameData={frameData} />
            <EventsSection events={events} currentFrame={currentFrame} />
            <InfosSection frameData={frameData} />
            <BallSection frameData={frameData} />
            <PlayersSection 
                frameData={frameData} 
                playerHits={playerHits}
            />
        </div>
    )
} 