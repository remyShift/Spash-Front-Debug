import React, { useEffect } from 'react'
import { JSONData } from '@/types/files';
import { useHomographyPoints } from '@/context/homographyPoints';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import { useSport } from '@/context/sport';

export default function HomographyEditor({ videoData }: { videoData: JSONData }) {
    const jsonHomographyPoints = videoData.info.homography;
    const { homographyPoints, setHomographyPoints } = useHomographyPoints();
    const { currentSport } = useSport();

    useEffect(() => {
        setHomographyPoints(jsonHomographyPoints);
    }, [setHomographyPoints, jsonHomographyPoints]);

    const handleCopyToClipboard = () => {
        const pointOrder = currentSport === 'padel' ? [
            "TOP_LEFT_CORNER",
            "TOP_LEFT_SERVICE_LINE",
            "TOP_NET",
            "TOP_RIGHT_SERVICE_LINE",
            "TOP_RIGHT_CORNER",
            "LEFT_T",
            "NET_CENTER",
            "RIGHT_T",
            "BOTTOM_LEFT_CORNER",
            "BOTTOM_LEFT_SERVICE_LINE",
            "BOTTOM_NET",
            "BOTTOM_RIGHT_SERVICE_LINE",
            "BOTTOM_RIGHT_CORNER"
        ] : [
            "TOP_LEFT_CORNER",
            "TOP_RIGHT_CORNER",
            "BOTTOM_LEFT_CORNER",
            "LEFT_GOAL_POST_BOT",
            "LEFT_GOAL_POST_TOP",
            "RIGHT_GOAL_POST_BOT",
            "RIGHT_GOAL_POST_TOP"
        ];

        const orderedPoints: { [key: string]: { camera: number[] } } = {};
        pointOrder.forEach(key => {
            if (homographyPoints[key]) {
                orderedPoints[key] = homographyPoints[key];
            }
        });

        navigator.clipboard.writeText(JSON.stringify(orderedPoints, null, 2))
            .then(() => {
                alert('Homography points copied to clipboard !');
            })
            .catch(err => {
                console.error('Error copying points:', err);
                alert('Error copying points');
            });
    };

    const handleCoordinateChange = (point: string, index: number, value: number) => {
        const newPoints = { ...homographyPoints };
        newPoints[point].camera[index] = value;
        setHomographyPoints(newPoints);
    };

    const adjustCoordinate = (point: string, index: number, increment: boolean) => {
        const newPoints = { ...homographyPoints };
        newPoints[point].camera[index] += increment ? 1 : -1;
        setHomographyPoints(newPoints);
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
                Object.keys(homographyPoints).map((point, index) => (
                    <div key={index} className='flex flex-col justify-center items-center gap-2'>
                        <p className='text-base text-white font-bold'>{point.toString()} :</p>
                        <div className='flex gap-12'>
                            {[0, 1].map((coordIndex) => (
                                <div key={coordIndex} className='flex justify-center items-center gap-1'>
                                    <button
                                        onClick={() => adjustCoordinate(point, coordIndex, false)}
                                        className='px-2 py-1 bg-primary text-white rounded-lg hover:bg-opacity-80'
                                    >
                                        <FontAwesomeIcon icon={faMinus} />
                                    </button>
                                    <input
                                        type="number"
                                        value={Math.round(homographyPoints[point].camera[coordIndex])}
                                        onChange={(e) => handleCoordinateChange(point, coordIndex, parseInt(e.target.value))}
                                        className='w-20 px-2 py-1 bg-lighterBackground text-white rounded-lg text-center'
                                    />
                                    <button
                                        onClick={() => adjustCoordinate(point, coordIndex, true)}
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
