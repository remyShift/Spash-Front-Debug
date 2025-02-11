import React, { useEffect, useRef } from 'react'
import { JSONData } from '@/types/files';
import { useHomographyPoints } from '@/context/homographyPoints';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import { useEditMode } from '@/context/editMode';

interface HomographyEditorProps {
    videoData: JSONData;
    accordionOpen: boolean;
}

export default function HomographyEditor({ videoData, accordionOpen }: HomographyEditorProps) {
    const jsonHomographyPoints = videoData.info.homography;
    const { homographyPoints, setHomographyPoints } = useHomographyPoints();
    const { setEditMode } = useEditMode();
    const originalPointsRef = useRef(jsonHomographyPoints);

    useEffect(() => {
        setHomographyPoints(jsonHomographyPoints);
        originalPointsRef.current = jsonHomographyPoints;
    }, [setHomographyPoints, jsonHomographyPoints]);

    useEffect(() => {
        if (accordionOpen) {
            setEditMode(true);
        } else {
            setEditMode(false);
            setHomographyPoints(originalPointsRef.current);
        }
    }, [accordionOpen, setEditMode, setHomographyPoints]);

    const handleCopyToClipboard = () => {
        const coordinates = Object.values(homographyPoints).map(point => point.camera);
        
        navigator.clipboard.writeText(JSON.stringify(coordinates, null, 2))
            .then(() => {
                alert('Coordinates copied to clipboard !');
            })
            .catch(err => {
                console.error('Error copying coordinates :', err);
                alert('Error copying coordinates');
            });
    };

    const handleCoordinateChange = (key: string, coordIndex: number, value: number) => {
        const newPoints = { ...homographyPoints };
        newPoints[key].camera[coordIndex] = value;
        setHomographyPoints(Object.values(newPoints));
    };

    const adjustCoordinate = (key: string, coordIndex: number, increment: boolean) => {
        const newPoints = { ...homographyPoints };
        newPoints[key].camera[coordIndex] += increment ? 1 : -1;
        setHomographyPoints(Object.values(newPoints));
    };

    return (
        <div className='flex flex-col gap-6 p-4'>
            <div className='flex justify-between items-center mb-4'>
                <div className='w-full flex justify-center items-center gap-2'>
                    <button 
                        onClick={handleCopyToClipboard}
                        className='px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-80 transition-all'
                    >
                        Save to Clipboard
                    </button>
                </div>
            </div>
            {
                Object.entries(homographyPoints).map(([key, point]) => (
                    <div key={key} className='flex flex-col justify-center items-center gap-2'>
                        <p className='text-base text-white font-bold'>{point.name || key} :</p>
                        <div className='flex gap-12'>
                            {[0, 1].map((coordIndex) => (
                                <div key={coordIndex} className='flex justify-center items-center gap-1'>
                                    <button
                                        onClick={() => adjustCoordinate(key, coordIndex, false)}
                                        className='px-2 py-1 bg-primary text-white rounded-lg hover:bg-opacity-80'
                                    >
                                        <FontAwesomeIcon icon={faMinus} />
                                    </button>
                                    <input
                                        type="number"
                                        value={Math.round(point.camera[coordIndex])}
                                        onChange={(e) => handleCoordinateChange(key, coordIndex, parseInt(e.target.value))}
                                        className='w-20 px-2 py-1 bg-lighterBackground text-white rounded-lg text-center'
                                    />
                                    <button
                                        onClick={() => adjustCoordinate(key, coordIndex, true)}
                                        className='px-2 py-1 bg-primary text-white rounded-lg hover:bg-opacity-80'
                                    >
                                        <FontAwesomeIcon icon={faPlus} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            }            
        </div>
    )
}
