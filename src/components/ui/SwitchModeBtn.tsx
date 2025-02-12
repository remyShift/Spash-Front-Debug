import { useMode } from "@/context/mode";

export default function SwitchModeBtn() {
    const { mode, setMode } = useMode();

    const handleChange = () => {
        setMode(mode === "dev" ? "commercial" : "dev");
    };

    return (
        <div className="switch-holder flex flex-col items-center gap-2">
            <div className="switch-label">
                <i className="fa fa-bluetooth-b" /><span className="text-sm font-bold text-white">Advanced</span>
            </div>
            <div className="switch-toggle">
                <input 
                    type="checkbox" 
                    id="bluetooth"
                    checked={mode === "dev"} 
                    onChange={handleChange}
                />
                <label htmlFor="bluetooth" />
            </div>
        </div>
    );
}
