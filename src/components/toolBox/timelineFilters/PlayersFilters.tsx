import CheckBox from '@/components/ui/CheckBox'
import { usePlayersFilters } from '@/context/playersFilters';

export default function PlayersFilters() {
    const { playersFilters, setPlayersFilters } = usePlayersFilters();

    const handlePlayerFilterChange = (player: string) => {
        if (playersFilters.includes(player)) {
            setPlayersFilters(playersFilters.filter((p) => p !== player));
        } else {
            setPlayersFilters([...playersFilters, player]);
        }

        console.log(playersFilters);
    }

    return (
        <div className="flex flex-col gap-2">
            <p className='text-white font-semibold text-center text-lg'>- - - - - Players - - - - -</p>
            <div className="flex gap-24 justify-center items-center">
                <div className="flex flex-col gap-2">
                    <CheckBox 
                        label="Player A" 
                        onChange={() => handlePlayerFilterChange("Player A")} 
                        checked={playersFilters.includes("Player A")}
                    />
                    <CheckBox 
                        label="Player B" 
                        onChange={() => handlePlayerFilterChange("Player B")} 
                        checked={playersFilters.includes("Player B")}
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <CheckBox 
                        label="Player C" 
                        onChange={() => handlePlayerFilterChange("Player C")} 
                        checked={playersFilters.includes("Player C")}
                    />
                    <CheckBox 
                        label="Player D" 
                        onChange={() => handlePlayerFilterChange("Player D")} 
                        checked={playersFilters.includes("Player D")}
                    />
                </div>
            </div>
        </div>
    )
}
