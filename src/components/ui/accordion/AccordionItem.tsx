import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
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
                <span className="text-white font-semibold text-lg text-center">{title}</span>
                <FontAwesomeIcon icon={faArrowDown} className={`${accordionOpen ? "rotate-180" : ""} transition-all duration-200 ease-out text-primary`} />
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
