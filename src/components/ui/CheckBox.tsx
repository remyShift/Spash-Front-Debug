import { useState } from "react";

export default function CheckBox({label}: {label: string}) {
    const [checked, setChecked] = useState(false);

    return (
        <div className="checkbox-wrapper">
            <input type="checkbox" className={`${checked ? "check" : ""}`} id="check1-61" onChange={() => setChecked(!checked)} />
            <label htmlFor="check1-61" className="label flex items-center gap-2">
                <svg width={35} height={35} viewBox="0 0 95 95">
                    <rect x={30} y={20} width={50} height={50} stroke="white" fill="none" />
                    <g transform="translate(0,-952.36222)">
                    <path d="m 56,963 c -102,122 6,9 7,9 17,-5 -66,69 -38,52 122,-77 -7,14 18,4 29,-11 45,-43 23,-4" stroke="#FF5F49" strokeWidth={3} fill="none" className="path1" />
                    </g>
                </svg>
                <span className="text-white font-semibold text-center">{label}</span>
            </label>
        </div>
    );
}
