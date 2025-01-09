import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";

export default function Accordion({ title, answer }: { title: string, answer: string }) {
    const [accordionOpen, setAccordionOpen] = useState(false);

    return (
        <div className="p-4">
            <button
                onClick={() => setAccordionOpen(!accordionOpen)}
                className="flex justify-center items-center w-full gap-4"
            >
                <span className="text-white font-semibold text-lg text-center">{title}</span>
                <FontAwesomeIcon icon={faArrowDown} className={`${accordionOpen ? "rotate-180" : ""} transition-all duration-200 ease-out text-primary`} />
            </button>
            <div
                className={`grid overflow-hidden transition-all duration-300 ease-in-out text-slate-600 text-sm ${
                accordionOpen
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0"
                }`}
            >
                <div className="overflow-hidden">{answer}</div>
            </div>
        </div>
    );
};
