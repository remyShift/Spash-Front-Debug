import React, { useEffect } from 'react'
import { JSONData } from '@/types/files';
import { useHomographyPoints } from '@/context/homographyPoints';

export default function HomographyEditor({ videoData }: { videoData: JSONData }) {
    const jsonHomographyPoints = videoData.info.homography;
    const { homographyPoints, setHomographyPoints } = useHomographyPoints();

    useEffect(() => {
        setHomographyPoints(jsonHomographyPoints);
    }, [setHomographyPoints, jsonHomographyPoints]);

    return (
        <div className='flex flex-col gap-2 p-4'>
            {
                Object.keys(homographyPoints).map((point, index) => (
                    <div key={index} className='flex justify-between'>
                        <p className='text-base text-white font-bold'>{point.toString()} :</p>
                        <p className='text-base text-white'>{homographyPoints[point].camera[0].toFixed(2)} - {homographyPoints[point].camera[1].toFixed(2)}</p>
                        
                    </div>
                ))
            }            

        </div>
    )
}
