import { useActiveLayers } from "@/context/layers";
import { Layers } from "@/types/layers";
import { useCanvas } from "@/context/canvas";
import { drawElements } from "@/utils/drawing/drawElements";
import { useCallback } from "react";
import { JSONData } from "@/types/files";

export default function ButtonLayer({ 
    content, 
    handleClick, 
    jsonData 
}: { 
    content: string, 
    handleClick: () => void,
    jsonData?: JSONData 
}) {
    const { activeLayers } = useActiveLayers();
    const { mainCanvasRef, persistentCanvasRef } = useCanvas();
    const isActive = activeLayers.includes(content as Layers) || content === "layers";

    const handleButtonClick = useCallback(() => {
        handleClick();
        
        if (!isActive && jsonData && mainCanvasRef?.current && persistentCanvasRef?.current) {
            const video = document.querySelector('video');
            if (video) {
                drawElements(
                    jsonData,
                    [...activeLayers, content as Layers],
                    video,
                    {
                        mainCanvas: mainCanvasRef.current,
                        persistentCanvas: persistentCanvasRef.current
                    }
                );
            }
        } else if (isActive && mainCanvasRef?.current && persistentCanvasRef?.current) {
            const video = document.querySelector('video');
            if (video) {
                const updatedLayers = activeLayers.filter(layer => layer !== content);
                drawElements(
                    jsonData as JSONData,
                    updatedLayers,
                    video,
                    {
                        mainCanvas: mainCanvasRef.current,
                        persistentCanvas: persistentCanvasRef.current
                    }
                );
            }
        }
    }, [handleClick, jsonData, mainCanvasRef, persistentCanvasRef, activeLayers, content, isActive]);

    return (
        <button 
            className={`w-fit px-3 h-8 bg-primary rounded-t-md transition-opacity duration-300 text-white font-semibold active:opacity-80 text-base ${isActive ? "opacity-100" : "opacity-50"}`}
            onClick={handleButtonClick}
        >
            {content.charAt(0).toUpperCase() + content.slice(1)}
        </button>
    );
}
