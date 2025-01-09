import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface ControlBtnProps {
    icon: IconProp;
    onClick: () => void;
    text: string;
}

export default function ControlBtn({ icon, onClick, text }: ControlBtnProps) {
    return (
        <div className="flex flex-col gap-0">
            <p className="text-white text-sm text-center">{text}</p>
            <button className="bg-primary text-white font-semibold text-base rounded-md px-3 py-[2px] active:bg-orange-500 transition-all duration-200"
                    onClick={onClick}>
                <FontAwesomeIcon icon={icon} />
            </button>
        </div>
    )
}
