export default function KeyboardShortcuts({ accordionOpen }: { accordionOpen: boolean }) {
    return (
        <div className={`p-4 bg-lightBackground rounded-md ${accordionOpen ? "block" : "hidden"} transition-all duration-300 ease-in-out`}>
            <ul className="text-white/80 text-sm space-y-1">
                <li>⬅️ : Frame précédente</li>
                <li>➡️ : Frame suivante</li>
                <li>Shift + ⬅️ : -100 frames</li>
                <li>Shift + ➡️ : +100 frames</li>
                <li>Espace : Play/Pause</li>
            </ul>
        </div>
    );
}