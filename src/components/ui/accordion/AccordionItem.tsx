import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import Spacer from "../Spacer";
import { useActiveAccordion } from "@/utils/activeAccordion";

export default function AccordionItem({ title, content }: { title: string, content: React.ReactElement<{ accordionOpen: boolean }> }) {
    const { activeAccordion, setActiveAccordion } = useActiveAccordion();
    const isOpen = activeAccordion === title;

    const handleClick = () => {
        if (isOpen) {
            setActiveAccordion(null);
        } else {
            setActiveAccordion(title);
        }
    };

    const contentWithProps = React.cloneElement(content as React.ReactElement<{ accordionOpen: boolean }>, {
        accordionOpen: isOpen
    });

    return (
        <div className="w-full">
            <button
                onClick={handleClick}
                className="flex justify-center items-center w-full gap-4 p-4"
            >
                <FontAwesomeIcon icon={faArrowRight} className={`${isOpen ? "rotate-90" : ""} transition-all duration-200 ease-out text-primary`} />
                <span className="text-white font-semibold text-lg text-center">{title}</span>
            </button>

            {isOpen && <Spacer />}

            <div
                className={`grid overflow-hidden transition-all duration-300 ease-in-out text-slate-600 text-sm`}
                style={{
                    gridTemplateRows: isOpen ? '1fr' : '0fr',
                    opacity: isOpen ? 1 : 0,
                    visibility: isOpen ? 'visible' : 'hidden'
                }}
            >
                <div className="overflow-hidden min-h-0">
                    {contentWithProps}
                </div>
            </div>
        </div>
    );
}
