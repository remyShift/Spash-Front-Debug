import CheckBox from '@/components/ui/CheckBox'

export default function PlayersFilters() {
    return (
        <div className="flex flex-col gap-2">
            <p className='text-white font-semibold text-center text-lg'>- - - - - Players - - - - -</p>
            <div className="flex gap-24 justify-center items-center">
                <div className="flex flex-col gap-2">
                    <CheckBox label="Player A" />
                    <CheckBox label="Player B" />
                </div>
                <div className="flex flex-col gap-2">
                    <CheckBox label="Player C" />
                    <CheckBox label="Player D" />
                </div>
            </div>
        </div>
    )
}
