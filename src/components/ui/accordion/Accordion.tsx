import React from 'react'
import AccordionItem from './AccordionItem'
import Spacer from '../Spacer'
import KeyboardShortcuts from '../../toolBox/KeyboardShortcuts'
import { JSONData } from '@/types/files'
import FrameInfos from '../../toolBox/FrameInfos'

export default function Accordion({ videoData }: { videoData: JSONData }) {
    return (
        <div className="w-full bg-lightBackground rounded-b-lg">
            <AccordionItem title="Homography" content={<KeyboardShortcuts accordionOpen={false} />} />
            <Spacer />
            <AccordionItem title="Frame Info" content={<FrameInfos framesData={videoData.data} events={videoData.events} />} />
            <Spacer />
            <AccordionItem title="Keyboard Shortcuts" content={<KeyboardShortcuts accordionOpen={false} />} />
        </div>
    )
}