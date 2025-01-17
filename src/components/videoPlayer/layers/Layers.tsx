import React from 'react'
import ButtonLayer from './ButtonLayer'
import { useActiveLayers } from '@/context/layers';

export default function Layers() {
    const { toggleActiveLayers } = useActiveLayers();

    return (
        <div className="flex flex-row gap-1">
            <ButtonLayer content="layers" handleClick={() => {}} />
            <ButtonLayer content="homography" handleClick={() => toggleActiveLayers('homography')} />
            <ButtonLayer content="players" handleClick={() => toggleActiveLayers('players')} />
            <ButtonLayer content="ball" handleClick={() => toggleActiveLayers('ball')} />
            <ButtonLayer content="areas" handleClick={() => toggleActiveLayers('areas')} />
            <ButtonLayer content="trajectories" handleClick={() => toggleActiveLayers('trajectories')} />
            <ButtonLayer content="hits" handleClick={() => toggleActiveLayers('hits')} />
            <ButtonLayer content="distance" handleClick={() => toggleActiveLayers('distance')} />
            <ButtonLayer content="rebounds" handleClick={() => toggleActiveLayers('rebounds')} />
        </div>
    )
}