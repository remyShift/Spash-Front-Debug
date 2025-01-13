import { faBackwardStep, faForwardStep } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function TimelineControl({ event }: { event: string }) {
    return (
        <div className="flex items-center h-full w-[13%] gap-4 px-4">
            <FontAwesomeIcon icon={faBackwardStep} className="text-secondary text-xl" />
            <h2 className="text-white font-semibold text-xl">{event}</h2>
            <FontAwesomeIcon icon={faForwardStep} className="text-secondary text-xl" />
        </div>
    )
}