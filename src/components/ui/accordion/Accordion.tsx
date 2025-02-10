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

export default function Accordion({ videoData }: { videoData: JSONData }) {
    const accordionRef = useRef<HTMLDivElement>(null);
    const { currentSport } = useSport();
    const { setAccordionHeight } = useAccordionHeight();

    useEffect(() => {
        const updateHeight = () => {
            if (accordionRef.current) {
                setAccordionHeight(accordionRef.current.offsetHeight);
            }
        };

        updateHeight();
        window.addEventListener('resize', updateHeight);
        
        const observer = new ResizeObserver(updateHeight);
        if (accordionRef.current) {
            observer.observe(accordionRef.current);
        }

        return () => {
            window.removeEventListener('resize', updateHeight);
            observer.disconnect();
        };
    }, [setAccordionHeight]);

    const fieldSize = calculateFootFieldSize(videoData.info);
    
    if (!fieldSize) return;

    return (
        <div ref={accordionRef} className="w-full bg-lightBackground rounded-b-lg">
            <AccordionItem title="Radar" content={currentSport === 'padel' ? 
                <PadelRadar framesData={videoData.data} /> : 
                <FootballRadar framesData={videoData.data} fieldSize={fieldSize} />} />
            <Spacer />
            <AccordionItem title="Frame Info" content={<FrameInfos framesData={videoData.data} events={videoData.events} />} />
            <Spacer />
            <AccordionItem title="Keyboard Shortcuts" content={<KeyboardShortcuts accordionOpen={false} />} />
            <Spacer />
            <AccordionItem title="Homography Editor" content={<HomographyEditor videoData={videoData} />} />
        </div>
    )
}