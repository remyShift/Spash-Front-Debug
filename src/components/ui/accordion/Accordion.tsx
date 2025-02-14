import React, { useEffect, useRef } from 'react'
import AccordionItem from './AccordionItem'
import Spacer from '../Spacer'
import KeyboardShortcuts from '../../toolBox/KeyboardShortcuts'
import { JSONData } from '@/types/files'
import FrameInfos from '../../toolBox/frameInfos/FrameInfos'
import PadelRadar from '@/components/toolBox/radar/PadelRadar'
import { useAccordionHeight } from '@/context/accordion'
import HomographyEditor from '@/components/toolBox/HomographyEditor'
import { useSport } from '@/context/sport'
import FootballRadar from '@/components/toolBox/radar/FootballRadar'
import { calculateFootFieldSize } from '@/utils/calculateFootFieldSize'
import { useMode } from '@/context/mode'
import TimelineFilters from '@/components/toolBox/timelineFilters/TimelineFilters'

export default function Accordion({ videoData }: { videoData: JSONData }) {
    const accordionRef = useRef<HTMLDivElement>(null);
    const { currentSport } = useSport();
    const { setAccordionHeight } = useAccordionHeight();
    const { mode } = useMode();

    useEffect(() => {
        const updateHeight = () => {
            if (accordionRef.current) {
                const height = accordionRef.current.getBoundingClientRect().height;
                setAccordionHeight(height);
            }
        };

        const timeoutId = setTimeout(updateHeight, 300);
        
        const observer = new ResizeObserver(() => {
            updateHeight();
        });

        if (accordionRef.current) {
            observer.observe(accordionRef.current);
        }

        window.addEventListener('resize', updateHeight);

        return () => {
            clearTimeout(timeoutId);
            window.removeEventListener('resize', updateHeight);
            observer.disconnect();
        };
    }, [setAccordionHeight]);

    const fieldSize = calculateFootFieldSize(videoData.info);
    
    if (!fieldSize && currentSport === 'foot') return;

    return (
        <div ref={accordionRef} className="w-full bg-lightBackground rounded-b-lg">
            <AccordionItem title="Radar" content={currentSport === 'padel' ? 
                <PadelRadar framesData={videoData.data} /> : 
                fieldSize ? <FootballRadar framesData={videoData.data} fieldSize={fieldSize} /> : <div />} />
            <Spacer />
            <AccordionItem title="Frame Info" content={<FrameInfos framesData={videoData.data} events={videoData.events} />} />
            <Spacer />
            {mode === "dev" && (
                <>
                    <AccordionItem title="Homography Editor" content={<HomographyEditor videoData={videoData} accordionOpen={false} />} />
                    <Spacer />
                </>
            )}
            {currentSport === "padel" && (
                <>
                    <AccordionItem title="Timeline Filters" content={<TimelineFilters jsonData={videoData} />} />
                    <Spacer />
                </>
            )}
            <AccordionItem title="Keyboard Shortcuts" content={<KeyboardShortcuts accordionOpen={false} />} />
        </div>
    )
}