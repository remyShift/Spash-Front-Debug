import { useState } from 'react';
import { useActiveLayers } from '@/context/layers';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { JSONData } from '@/types/files';
import ButtonLayer from './ButtonLayer';

export default function LayersMenu({ jsonData }: { jsonData: JSONData }) {
    const [isOpen, setIsOpen] = useState(false);
    const { toggleActiveLayers } = useActiveLayers();
    
    const layers = [
        { content: "players", handleClick: () => toggleActiveLayers('players') },
        { content: "ball", handleClick: () => toggleActiveLayers('ball') },
        { content: "areas-ab", handleClick: () => toggleActiveLayers('areas-ab') },
        { content: "areas-cd", handleClick: () => toggleActiveLayers('areas-cd') },
        { content: "trajectories", handleClick: () => toggleActiveLayers('trajectories') },
        { content: "hits", handleClick: () => toggleActiveLayers('hits') },
        { content: "distance", handleClick: () => toggleActiveLayers('distance') },
        { content: "rebounds", handleClick: () => toggleActiveLayers('rebounds') },
        { content: "homography", handleClick: () => toggleActiveLayers('homography') },
        { content: "divorces", handleClick: () => toggleActiveLayers('divorces') },
        { content: "top lob", handleClick: () => toggleActiveLayers('top lob') },
        { content: "safe ball", handleClick: () => toggleActiveLayers('safe ball') }
    ];

    return (
        <div className="absolute top-3 left-3 z-50">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="bg-transparent rounded-md"
            >
                <FontAwesomeIcon icon={faBars} className="text-white hover:text-primary transition-all duration-300 text-xl" />
            </button>

            {isOpen && (
                <div className="absolute top-8 left-0 bg-lightBackground rounded-md shadow-lg">
                    <div className="flex flex-col max-h-[70vh] overflow-y-auto w-full">
                        {layers.map((layer, index) => (
                            <div key={layer.content}>
                                <ButtonLayer
                                    content={layer.content}
                                    handleClick={layer.handleClick}
                                    jsonData={jsonData}
                                />
                                {index !== layers.length - 1 && (
                                    <div className="h-px w-full bg-lighterBackground" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
} 