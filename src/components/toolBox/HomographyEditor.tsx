import React, { useEffect } from 'react'
import { JSONData } from '@/types/files';
import { useHomographyPoints } from '@/context/homographyPoints';

export default function HomographyEditor({ videoData }: { videoData: JSONData }) {
    const jsonHomographyPoints = videoData.info.homography;
    const { homographyPoints, setHomographyPoints } = useHomographyPoints();

    useEffect(() => {
        setHomographyPoints(jsonHomographyPoints);
    }, [setHomographyPoints, jsonHomographyPoints]);

    const handleCopyToClipboard = () => {
        const pointOrder = [
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

    return (
        <div className='flex flex-col gap-2 p-4'>
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
                    <div key={index} className='flex justify-between'>
                        <p className='text-base text-white font-bold'>{point.toString()} :</p>
                        <p className='text-base text-white'>{Math.round(homographyPoints[point].camera[0])} - {Math.round(homographyPoints[point].camera[1])}</p>
                    </div>
                ))
            }            
        </div>
    )
}
