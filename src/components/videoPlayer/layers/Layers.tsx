import React from 'react'
import ButtonLayer from './ButtonLayer'
import { useActiveLayers } from '@/context/layers';
import { JSONData } from '@/types/files';

export default function Layers({ jsonData }: { jsonData: JSONData }) {
    const { toggleActiveLayers } = useActiveLayers();

    return (
        <div className="flex flex-row gap-1">
            <ButtonLayer content="layers" handleClick={() => {}} jsonData={jsonData} />
            <ButtonLayer content="players" handleClick={() => toggleActiveLayers('players')} jsonData={jsonData} />
            <ButtonLayer content="ball" handleClick={() => toggleActiveLayers('ball')} jsonData={jsonData} />
            <ButtonLayer content="areas" handleClick={() => toggleActiveLayers('areas')} jsonData={jsonData} />
            <ButtonLayer content="trajectories" handleClick={() => toggleActiveLayers('trajectories')} jsonData={jsonData} />
            <ButtonLayer content="hits" handleClick={() => toggleActiveLayers('hits')} jsonData={jsonData} />
            <ButtonLayer content="distance" handleClick={() => toggleActiveLayers('distance')} jsonData={jsonData} />
            <ButtonLayer content="rebounds" handleClick={() => toggleActiveLayers('rebounds')} jsonData={jsonData} />
        </div>
    )
}