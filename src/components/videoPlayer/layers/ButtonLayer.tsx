import { useActiveLayers } from "@/context/layers";
import { Layers } from "@/types/layers";

export default function ButtonLayer({ content, handleClick }: { content: string, handleClick: () => void }) {
    const { activeLayers } = useActiveLayers();
    const isActive = activeLayers.includes(content as Layers) || content === "layer";

    return (
        <button className={`w-fit px-3 h-8 bg-primary rounded-t-md transition-opacity duration-300 text-white font-semibold text-base ${isActive ? "opacity-100" : "opacity-50"}`}
            onClick={handleClick}
        >
            {content.charAt(0).toUpperCase() + content.slice(1)}
        </button>
    )
}
