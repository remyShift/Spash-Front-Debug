export default function KeyboardShortcuts({ accordionOpen }: { accordionOpen: boolean }) {
    return (
        <div className={`flex p-4 bg-lightBackground ${accordionOpen ? "block" : "hidden"} transition-all duration-300 ease-in-out rounded-b-lg w-full`}>
            <ul className="text-sm space-y-2 w-1/3">
                <li className="flex text-primary justify-center items-center gap-6 font-semibold">⬅️</li>
                <li className="flex text-primary justify-center items-center gap-6 font-semibold">➡️</li>
                <li className="flex text-primary justify-center items-center gap-6 font-semibold">Shift + ⬅️</li>
                <li className="flex text-primary justify-center items-center gap-6 font-semibold">Shift + ➡️</li>
                <li className="flex text-primary justify-center items-center gap-6 font-semibold">Espace</li>
                <li className="flex text-primary justify-center items-center gap-6 font-semibold">P</li>
                <li className="flex text-primary justify-center items-center gap-6 font-semibold">B</li>
                <li className="flex text-primary justify-center items-center gap-6 font-semibold">A</li>
                <li className="flex text-primary justify-center items-center gap-6 font-semibold">H</li>
                <li className="flex text-primary justify-center items-center gap-6 font-semibold">T</li>
            </ul>

            <ul className="text-sm space-y-2 w-1/3">
                <li className="flex text-white justify-center items-center gap-6">|</li>
                <li className="flex text-white justify-center items-center gap-6">|</li>
                <li className="flex text-white justify-center items-center gap-6">|</li>
                <li className="flex text-white justify-center items-center gap-6">|</li>
                <li className="flex text-white justify-center items-center gap-6">|</li>
                <li className="flex text-white justify-center items-center gap-6">|</li>
                <li className="flex text-white justify-center items-center gap-6">|</li>
                <li className="flex text-white justify-center items-center gap-6">|</li>
                <li className="flex text-white justify-center items-center gap-6">|</li>
                <li className="flex text-white justify-center items-center gap-6">|</li>
            </ul>

            <ul className="text-sm space-y-2 w-1/3">
                <li className="flex text-white justify-center items-center gap-6">- 1 frame</li>
                <li className="flex text-white justify-center items-center gap-6">+ 1 frame</li>
                <li className="flex text-white justify-center items-center gap-6">- 100 frames</li>
                <li className="flex text-white justify-center items-center gap-6">+ 100 frames</li>
                <li className="flex text-white justify-center items-center gap-6">Play/Pause</li>
                <li className="flex text-white justify-center items-center gap-6">Players</li>
                <li className="flex text-white justify-center items-center gap-6">Ball</li>
                <li className="flex text-white justify-center items-center gap-6">Areas</li>
                <li className="flex text-white justify-center items-center gap-6">Homography</li>
                <li className="flex text-white justify-center items-center gap-6">Trajectories</li>
            </ul>
        </div>
    );
}