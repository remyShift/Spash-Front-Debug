import StatBlock from "./StatBlock";
import StatText from "./StatText";
import { extractStatsStructure } from "@/utils/statsStructure";

export default function StatsCategoryColumn({ player }: { player: object }) {
    const structure = extractStatsStructure(player);

    return (
        <div className="flex flex-col gap-3 justify-end">
            {structure.map((category, index) => (
                <StatBlock 
                    key={index} 
                    index={index} 
                    isEven={index % 2 === 0} 
                    rowCount={category.rowCount}
                > 
                    <StatText value={category.name} />
                </StatBlock>
            ))}
        </div>
    );
}
