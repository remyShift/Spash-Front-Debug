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
    content: string, 
    handleClick: () => void,
    jsonData?: JSONData 
}) {
    const { activeLayers } = useActiveLayers();
    const { mainCanvasRef, persistentCanvasRef } = useCanvas();
    const { sport } = useSport();
    
    const typedActiveLayers = sport === 'padel' 
        ? (activeLayers as PadelLayers[]) 
        : (activeLayers as FootballLayers[]);

    const typedContent = sport === 'padel' 
        ? (content as PadelLayers) 
        : (content as FootballLayers);
    const isActive = typedActiveLayers.includes(typedContent) || content === "layers";

    const handleButtonClick = useCallback(() => {
        handleClick();
        
        if (!mainCanvasRef?.current || !persistentCanvasRef?.current || !jsonData) return;
        
        const video = document.querySelector('video');
        if (!video) return;

        const updatedLayers = isActive 
            ? typedActiveLayers.filter(layer => layer !== typedContent)
            : [...typedActiveLayers, typedContent];

        drawSportElements(
            sport,
            jsonData,
            updatedLayers,
            video,
            {
                mainCanvas: mainCanvasRef.current,
                persistentCanvas: persistentCanvasRef.current
            },
        );
    }, [handleClick, jsonData, mainCanvasRef, persistentCanvasRef, typedActiveLayers, typedContent, isActive, sport]);

    return (
        <div 
            className={`w-full px-4 py-2 bg-lightBackground cursor-pointer transition-all duration-300 text-white font-semibold ${isActive ? "bg-primary" : ""}`}
            onClick={handleButtonClick}
        >
            <div className="flex items-center whitespace-nowrap overflow-hidden">
                <p className="text-white font-semibold truncate text-sm">
                    {typedContent.charAt(0).toUpperCase() + typedContent.slice(1)}
                </p>
            </div>
        </div>
    );
}
