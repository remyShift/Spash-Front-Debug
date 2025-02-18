import { useActiveLayers } from "@/context/layers";
import { FootballLayers, PadelLayers } from "@/types/layers";
import { useCanvas } from "@/context/canvas";
import { useCallback } from "react";
import { JSONData } from "@/types/files";
import { useSport } from "@/context/sport";
import { drawSportElements } from "@/utils/drawing/drawSportElements";

export default function ButtonLayer({ 
    content, 
    handleClick, 
    jsonData 
}: { 
    content: FootballLayers | PadelLayers, 
    handleClick: () => void,
    jsonData?: JSONData 
}) {
    const { activeLayers } = useActiveLayers();
    const { mainCanvasRef, persistentCanvasRef } = useCanvas();
    const { currentSport } = useSport();
    
    const isActive = activeLayers.includes(content);

    const handleButtonClick = useCallback(() => {
        handleClick();
        
        if (!mainCanvasRef?.current || !persistentCanvasRef?.current || !jsonData) return;
        
        const video = document.querySelector('video');
        if (!video) return;

        const updatedLayers = isActive 
            ? activeLayers.filter(layer => layer !== content)
            : [...activeLayers, content];

        drawSportElements(
            currentSport,
            jsonData,
            updatedLayers as FootballLayers[] | PadelLayers[],
            video,
            {
                mainCanvas: mainCanvasRef.current,
                persistentCanvas: persistentCanvasRef.current
            },
        );
    }, [handleClick, jsonData, mainCanvasRef, persistentCanvasRef, activeLayers, content, isActive, currentSport]);

    return (
        <div 
            className={`w-full px-4 py-2 bg-lightBackground cursor-pointer transition-all duration-300 text-white font-semibold ${isActive ? "bg-primary" : ""}`}
            onClick={handleButtonClick}
        >
            <div className="flex items-center whitespace-nowrap overflow-hidden">
                <p className="text-white font-semibold truncate text-sm">
                    {content.charAt(0).toUpperCase() + content.slice(1)}
                </p>
            </div>
        </div>
    );
}
