import React from 'react'
import StatBlock from './StatBlock'
import StatText from './StatText'
import StatBlockSpacer from './StatBlockSpacer'

export default function StatsNameColumn() {
    return (
        <div className="flex flex-col justify-start gap-3">
            <StatBlock index={-1} isEven={false} className="gap-2 pt-2" rowCount={4}>
                <StatText value="NoMansLand" />
                <StatBlockSpacer />
                <StatText value="Attack" />
                <StatBlockSpacer />
                <StatText value="Defense" />
                <StatBlockSpacer />
                <StatText value="Total" />
            </StatBlock>

            <StatBlock index={-1} isEven={true} className="gap-2" rowCount={5}>
                <StatText value="Lob and Go" />
                <StatBlockSpacer />
                <StatText value="Net Taking" />
                <StatBlockSpacer />
                <StatText value="Attack Position" />
                <StatBlockSpacer />
                <StatText value="Hit and Move" />
                <StatBlockSpacer />
                <StatText value="Total" />
            </StatBlock>

            <StatBlock index={-1} isEven={false} className="gap-2" rowCount={7}>
                <StatText value="First Serve" />
                <StatBlockSpacer />
                <StatText value="Volley Service" />
                <StatBlockSpacer />
                <StatText value="Services" />
                <StatBlockSpacer />
                <StatText value="Diagonal" />
                <StatBlockSpacer />
                <StatText value="Top Lob" />
                <StatBlockSpacer />
                <StatText value="Divorce Zone" />
                <StatBlockSpacer />
                <StatText value="Safe Ball" />
                <StatBlockSpacer />
                <StatText value="Total" />
            </StatBlock>

            <StatBlock index={-1} isEven={true} className="gap-2" rowCount={3}>
                <StatText value="Chain Breaks" />
                <StatBlockSpacer />
                <StatText value="Checks" />
                <StatBlockSpacer />
                <StatText value="Total" />
            </StatBlock>

            <StatBlock index={-1} isEven={false} className="gap-2" rowCount={4}>
                <StatText value="Distance" />
                <StatBlockSpacer />
                <StatText value="Calories" />
                <StatBlockSpacer />
                <StatText value="Intensities" />
                <StatBlockSpacer />
                <StatText value="Total" />
            </StatBlock>

            <StatBlock index={-1} isEven={true} rowCount={3}>
                <StatText value="Top Badges" />
            </StatBlock>

            <StatBlock index={-1} isEven={false} rowCount={2}>
                <StatText value="" />
            </StatBlock>

            <StatBlock index={-1} isEven={true} rowCount={3}>
                <StatText value="" />
            </StatBlock>
        </div>
    )
}
