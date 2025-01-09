import React from 'react'
import AccordionItem from './AccordionItem'
import Spacer from '../Spacer'

export default function Accordion() {
    return (
        <div className="w-full bg-lightBackground">
            <AccordionItem title="Homography" answer="Yes. It adheres to the WAI-ARIA design pattern." />
            <Spacer />
            <AccordionItem title="Frame Info" answer="Yes. It adheres to the WAI-ARIA design pattern." />
            <Spacer />
        </div>
    )
}