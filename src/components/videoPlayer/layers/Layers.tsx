import React from 'react'
import ButtonLayer from './ButtonLayer'
import { useActiveLayers } from '@/context/layers';
import { JSONData } from '@/types/files';

export default function Layers({ jsonData }: { jsonData: JSONData }) {
    const { toggleActiveLayers } = useActiveLayers();

    return (
        <div className="flex flex-row gap-1 w-[90%] overflow-x-auto overflow-y-hidden hide-scrollbar">
            <ButtonLayer content="layers" handleClick={() => {}} jsonData={jsonData} />
            <ButtonLayer content="players" handleClick={() => toggleActiveLayers('players')} jsonData={jsonData} />
            <ButtonLayer content="ball" handleClick={() => toggleActiveLayers('ball')} jsonData={jsonData} />
            <ButtonLayer content="areas-ab" handleClick={() => toggleActiveLayers('areas-ab')} jsonData={jsonData} />
            <ButtonLayer content="areas-cd" handleClick={() => toggleActiveLayers('areas-cd')} jsonData={jsonData} />
            <ButtonLayer content="trajectories" handleClick={() => toggleActiveLayers('trajectories')} jsonData={jsonData} />
            <ButtonLayer content="hits" handleClick={() => toggleActiveLayers('hits')} jsonData={jsonData} />
            <ButtonLayer content="distance" handleClick={() => toggleActiveLayers('distance')} jsonData={jsonData} />
            <ButtonLayer content="rebounds" handleClick={() => toggleActiveLayers('rebounds')} jsonData={jsonData} />
            <ButtonLayer content="homography" handleClick={() => toggleActiveLayers('homography')} jsonData={jsonData} />
            <ButtonLayer content="divorces" handleClick={() => toggleActiveLayers('divorces')} jsonData={jsonData} />
            <ButtonLayer content="top lob" handleClick={() => toggleActiveLayers('top lob')} jsonData={jsonData} />
            <ButtonLayer content="safe ball" handleClick={() => toggleActiveLayers('safe ball')} jsonData={jsonData} />
        </div>
    )
}