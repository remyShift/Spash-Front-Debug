import React from 'react'
import AccordionItem from './AccordionItem'
import Spacer from '../Spacer'
import KeyboardShortcuts from './KeyboardShortcuts'

export default function Accordion() {
    return (
        <div className="w-full bg-lightBackground">
            <AccordionItem title="Homography" content={<KeyboardShortcuts accordionOpen={false} />} />
            <Spacer />
            <AccordionItem title="Frame Info" content={<KeyboardShortcuts accordionOpen={false} />} />
            <Spacer />
            <AccordionItem title="Keyboard Shortcuts" content={<KeyboardShortcuts accordionOpen={false} />} />
        </div>
    )
}