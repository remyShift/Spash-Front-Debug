import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface ControlBtnProps {
    icon: IconProp;
    onClick: () => void;
    text: string;
    disabled?: boolean;
}

export default function ControlBtn({ icon, onClick, text, disabled = false }: ControlBtnProps) {
    return (
        <div className="flex flex-col gap-0">
            <p className="text-white text-sm text-center">{text}</p>
            <button className={`bg-primary text-white font-semibold flex items-center justify-center text-base rounded-md px-3 py-1 active:bg-orange-500 transition-all duration-200 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={onClick}
                    disabled={disabled}>
                <FontAwesomeIcon icon={icon} />
            </button>
        </div>
    );
}
