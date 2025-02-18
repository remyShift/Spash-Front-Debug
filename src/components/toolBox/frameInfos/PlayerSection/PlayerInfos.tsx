export const PlayerInfo = ({ label, value }: { label: string; value: string | number }) => (
    <p className='text-white flex gap-1 font-semibold'>{label} : 
        <span className='text-white font-normal'>{value}</span>
    </p>
);