import { useFrame } from '@/context/frame';
import { JSONData } from '@/types/files'
import { useEffect, useState } from 'react';

export default function FrameInfos({ framesData }: { framesData: JSONData['data'] }) {
    const { currentFrame } = useFrame();
    const [frameData, setFrameData] = useState<JSONData['data'][number] | null>(null);

    useEffect(() => {
        setFrameData(framesData[currentFrame]);
    }, [framesData, currentFrame]);

    console.log(frameData);

    return (
        <div>
            <p>Frame Infos</p>
            <p>toto</p>
        </div>
    )
}