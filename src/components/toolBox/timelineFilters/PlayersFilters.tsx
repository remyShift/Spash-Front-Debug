import CheckBox from '@/components/ui/CheckBox'
import { usePlayersFilters } from '@/context/playersFilters';

export default function PlayersFilters() {
    const { playersFilters, setPlayersFilters } = usePlayersFilters();

    const handlePlayerFilterChange = (player: string) => {
        const newFilters = playersFilters.includes(player)
            ? playersFilters.filter((p) => p !== player)
            : [...playersFilters, player];

        setPlayersFilters(newFilters);
        console.log(newFilters);
    }

    return (
        <div className="flex flex-col gap-2">
            <p className='text-white font-semibold text-center text-lg'>- - - - - Players - - - - -</p>
            <div className="flex gap-24 justify-center items-center">
                <div className="flex flex-col gap-2">
                    <CheckBox 
                        label="Player A" 
                        onChange={() => handlePlayerFilterChange("A")} 
                        checked={playersFilters.includes("A")}
                    />
                    <CheckBox 
                        label="Player B" 
                        onChange={() => handlePlayerFilterChange("B")} 
                        checked={playersFilters.includes("B")}
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <CheckBox 
                        label="Player C" 
                        onChange={() => handlePlayerFilterChange("C")} 
                        checked={playersFilters.includes("C")}
                    />
                    <CheckBox 
                        label="Player D" 
                        onChange={() => handlePlayerFilterChange("D")} 
                        checked={playersFilters.includes("D")}
                    />
                </div>
            </div>
        </div>
    )
}
