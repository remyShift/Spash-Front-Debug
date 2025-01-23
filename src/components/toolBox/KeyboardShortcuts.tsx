interface ShortcutItem {
    key: string;
    action: string;
}

const KEYBOARD_SHORTCUTS: ShortcutItem[] = [
    { key: "⬅️", action: "- 1 frame" },
    { key: "➡️", action: "+ 1 frame" },
    { key: "Shift + ⬅️", action: "- 100 frames" },
    { key: "Shift + ➡️", action: "+ 100 frames" },
    { key: "Espace", action: "Play/Pause" },
    { key: "P", action: "Players" },
    { key: "B", action: "Ball" },
    { key: "A", action: "Areas" },
    { key: "H", action: "Hits" },
    { key: "D", action: "Distance" },
    { key: "R", action: "Rebounds" },
    { key: "T", action: "Trajectories" },
    { key: "O", action: "Homography" }
];

export default function KeyboardShortcuts({ accordionOpen }: { accordionOpen: boolean }) {
    const baseClasses = "flex justify-center items-center gap-6";
    const columnClasses = "text-sm space-y-2 w-1/3";

    return (
        <div className={`flex p-4 bg-lightBackground ${accordionOpen ? "block" : "hidden"} transition-all duration-300 ease-in-out rounded-b-lg w-full`}>
            <ul className={columnClasses}>
                {KEYBOARD_SHORTCUTS.map(shortcut => (
                    <li key={shortcut.key} className={`${baseClasses} text-primary font-semibold`}>
                        {shortcut.key}
                    </li>
                ))}
            </ul>

            <ul className={columnClasses}>
                {KEYBOARD_SHORTCUTS.map(shortcut => (
                    <li key={shortcut.key} className={`${baseClasses} text-white`}>|</li>
                ))}
            </ul>

            <ul className={columnClasses}>
                {KEYBOARD_SHORTCUTS.map(shortcut => (
                    <li key={shortcut.key} className={`${baseClasses} text-white`}>
                        {shortcut.action}
                    </li>
                ))}
            </ul>
        </div>
    );
}