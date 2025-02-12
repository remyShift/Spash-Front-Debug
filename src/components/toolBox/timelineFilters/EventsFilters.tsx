import CheckBox from '@/components/ui/CheckBox'

export default function EventsFilters() {
    return (
        <div className="flex flex-col gap-2">
            <p className='text-white font-semibold text-center text-lg'>- - - - - Events - - - - -</p>
            <div className="flex gap-24 justify-center items-center">
                <div className="flex flex-col gap-2">
                    <CheckBox label="Hits" />
                    <CheckBox label="Services" />
                </div>
                <div className="flex flex-col gap-2">
                    <CheckBox label="Lobs" />
                    <CheckBox label="Checks" />
                </div>
            </div>
        </div>
    )
}
