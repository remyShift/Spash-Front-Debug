import React from 'react'

export const PlayerLegs = ({ legs }: { legs: number[] }) => (
    <div className='flex gap-1'>
        <p className='text-white flex gap-2 font-semibold'>Legs :</p>
        <div className='flex gap-2'>
            {legs.map((coord, index) => (
                <span key={index} className='text-white font-normal'>{coord.toFixed(2)}</span>
            ))}
        </div>
    </div>
);
