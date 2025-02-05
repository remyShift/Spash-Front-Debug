import React, { useEffect, useRef } from 'react'
import AccordionItem from './AccordionItem'
import Spacer from '../Spacer'
import KeyboardShortcuts from '../../toolBox/KeyboardShortcuts'
import { JSONData } from '@/types/files'
import FrameInfos from '../../toolBox/frameInfos/FrameInfos'
import HomographyRadar from '@/components/toolBox/HomographyRadar'
import { useAccordionHeight } from '@/context/accordion'
import HomographyEditor from '@/components/toolBox/HomographyEditor'

export default function Accordion({ videoData }: { videoData: JSONData }) {
    const accordionRef = useRef<HTMLDivElement>(null);
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

    return (
        <div ref={accordionRef} className="w-full bg-lightBackground rounded-b-lg">
            <AccordionItem title="Radar" content={<HomographyRadar framesData={videoData.data} />} />
            <Spacer />
            <AccordionItem title="Frame Info" content={<FrameInfos framesData={videoData.data} events={videoData.events} />} />
            <Spacer />
            <AccordionItem title="Keyboard Shortcuts" content={<KeyboardShortcuts accordionOpen={false} />} />
            <Spacer />
            <AccordionItem title="Homography Editor" content={<HomographyEditor videoData={videoData} />} />
        </div>
    )
}
