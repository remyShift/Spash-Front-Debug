import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
import Spacer from "../Spacer";

export default function AccordionItem({ title, answer }: { title: string, answer: string }) {
    const [accordionOpen, setAccordionOpen] = useState(false);

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
