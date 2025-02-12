import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import Spacer from "../Spacer";

export default function AccordionItem({ title, content }: { title: string, content: React.ReactElement<{ accordionOpen: boolean }> }) {
    const [accordionOpen, setAccordionOpen] = useState(false);

    const contentWithProps = React.cloneElement(content as React.ReactElement<{ accordionOpen: boolean }>, {
        accordionOpen
    });

    return (
        <div className="w-full">
            <button
                onClick={() => setAccordionOpen(!accordionOpen)}
                className="flex justify-center items-center w-full gap-4 p-4"
            >
                <FontAwesomeIcon icon={faArrowRight} className={`${accordionOpen ? "rotate-90" : ""} transition-all duration-200 ease-out text-primary`} />
                <span className="text-white font-semibold text-lg text-center">{title}</span>
            </button>

            {accordionOpen && <Spacer />}

            <div
                className={`grid overflow-hidden transition-all duration-300 ease-in-out text-slate-600 text-sm`}
                style={{
                    gridTemplateRows: accordionOpen ? '1fr' : '0fr',
                    opacity: accordionOpen ? 1 : 0,
                    visibility: accordionOpen ? 'visible' : 'hidden'
                }}
            >
                <div className="overflow-hidden min-h-0">
                    {contentWithProps}
                </div>
            </div>
        </div>
    );
};
