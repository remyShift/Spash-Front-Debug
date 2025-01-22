import { JSONData } from '@/types/files';

interface InfosSectionProps {
    frameData: JSONData['data'][number] | null;
}

export default function InfosSection({ frameData }: InfosSectionProps) {
    return (
        <div className='flex flex-col gap-2'>
            <p className='text-white font-semibold text-center text-lg'>- - - - - Infos - - - - -</p>
            <p className='text-white font-semibold flex gap-1'>Zone : 
                <span className='text-white font-normal'>{frameData?.zone}</span>
            </p>
            <p className='text-white font-semibold flex gap-1'>Detection : 
                <span className='text-white font-normal'>{frameData?.detection || "null"}</span>
            </p>
        </div>
    )
} 