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
            const ctx1 = mainCanvasRef.current.getContext('2d');
            const ctx2 = persistentCanvasRef.current.getContext('2d');
            
            if (ctx1 && ctx2) {
                ctx1.clearRect(0, 0, mainCanvasRef.current.width, mainCanvasRef.current.height);
                ctx2.clearRect(0, 0, persistentCanvasRef.current.width, persistentCanvasRef.current.height);
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
