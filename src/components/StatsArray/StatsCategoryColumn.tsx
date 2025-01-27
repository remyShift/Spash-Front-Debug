import StatBlock from "./StatBlock";
import StatText from "./StatText";

export default function StatsCategoryColumn() {
    const stats = [
        {
            "name": "Placement",
            "rowCount": 4
        },
        {
            "name": "Movement",
            "rowCount": 5
        },
        {
            "name": "Tactical",
            "rowCount": 8
        },
        {
            "name": "Team spirit",
            "rowCount": 3
        },
        {
            "name": "Physical",
            "rowCount": 4
        },
        {
            "name": "Badges",
            "rowCount": 3
        },
        {
            "name": "Sentence",
            "rowCount": 2
        },
        {
            "name": "Video",
            "rowCount": 3
        }
    ];
    return (
        <div className="flex flex-col gap-3">
            {stats.map((stat, index) => (
                <StatBlock key={index} index={index} isEven={index % 2 === 0} rowCount={stat.rowCount}> 
                    <StatText value={stat.name} />
                </StatBlock>
            ))}
        </div>
    ) 
}
