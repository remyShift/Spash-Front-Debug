export const PlayerZoneTime = ({ label, value }: { label: string; value: number }) => {
    const formattedTime = (value / 25) > 60 ? `${Math.floor((value / 25) / 60)}m${Math.floor((value / 25) % 60)}s` : `${value / 25}s`;
    return (
        <p className='text-white flex gap-1 font-semibold'>{label} : 
            <span className='text-white font-normal'>{formattedTime}</span>
        </p>
    );
};