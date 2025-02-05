import React from 'react'
import StatBlock from './StatBlock'
import StatText from './StatText'
import StatBlockSpacer from './StatBlockSpacer'
import { extractStatsStructure } from "@/utils/statsStructure"

export default function StatsNameColumn({ player }: { player: object }) {
    const structure = extractStatsStructure(player)

    return (
        <div className="flex flex-col justify-end gap-3">
            {structure.map((category, index) => {
                if (!category.subcategories) {
                    return (
                        <StatBlock 
                            key={category.key} 
                            index={-1} 
                            isEven={index % 2 === 0} 
                            className="gap-2" 
                            rowCount={category.rowCount}
                        >
                            <StatText value="" />
                        </StatBlock>
                    )
                }

                return (
                    <StatBlock 
                        key={category.key} 
                        index={-1} 
                        isEven={index % 2 === 0} 
                        className="gap-2" 
                        rowCount={category.rowCount}
                    >
                        {category.subcategories.map((subcat: string, idx: number) => (
                            <React.Fragment key={idx}>
                                <StatText 
                                    value={subcat.split('_')
                                        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                        .join(' ')} 
                                />
                                <StatBlockSpacer />
                            </React.Fragment>
                        ))}
                        <StatText value="Total" />
                    </StatBlock>
                )
            })}
        </div>
    )
}
