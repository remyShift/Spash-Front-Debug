import React from 'react';
import StatBlock from "./StatBlock";
import StatText from "./StatText";
import { useStore } from "@/context/store";
import { useParams } from "next/navigation";
import StatBlockSpacer from "./StatBlockSpacer";
import { extractStatsStructure } from "@/utils/statsStructure";
import { PlayerStats, Category, Badge, SubcategoryData } from "@/types/stats";

export default function PlayerStatsColumn({ index, playerStats }: { index: number, playerStats: PlayerStats }) {
    const playerNameColor = playerStats.name === "A" || playerStats.name === "B" ? "text-primary" : "text-green-500";
    const params = useParams();
    const paramsId = params.id as string;
    
    const videos = useStore((state) => state.videos);
    const currentFolder = videos.find(v => v.videoPath === decodeURIComponent(paramsId));
    const playerVideoPaths = Object.values(currentFolder?.playerVideoPath || {});
    const playerVideo = playerVideoPaths.find(p => p.split("/")[p.split("/").length - 1] === playerStats.video_path);
    const isEven = (blockIndex: number) => (index + blockIndex) % 2 === 0;
    const structure = extractStatsStructure(playerStats);

    const renderStatBlockContent = (category: Category) => {
        if (category.type === 'badges') {
            return playerStats.badges?.map((badge: Badge, i) => (
                badge.top_badge ? (
                    <div key={i}>
                        <StatText value={badge.value} label={badge.badge_type} />
                    </div>
                ) : null
            ));
        }

        if (category.type === 'text') {
            const value = playerStats[category.key];
            return typeof value === 'string' ? <StatText value={value} /> : null;
        }

        if (category.type === 'media') {
            return playerVideo && (
                <video src={playerVideo} className="w-full h-full object-contain" controls />
            );
        }

        if (category.subcategories) {
            const categoryData = playerStats[category.key] as SubcategoryData;
            return (
                <>
                    {category.subcategories.map((subcat: string, idx: number) => {
                        const subcatData = categoryData[subcat] as { score: number };
                        return (
                            <React.Fragment key={idx}>
                                <StatText value={subcatData.score} />
                                <StatBlockSpacer />
                            </React.Fragment>
                        );
                    })}
                    <StatText value={categoryData.score} playerColor={playerNameColor} />
                </>
            );
        }

        return null;
    };

    return (
        <div className="flex flex-col justify-start gap-3">
            <StatBlock index={index} isEven={isEven(0)} rowCount={3}>
                <StatText value={`Player ${playerStats.name}`} playerColor={playerNameColor} />
            </StatBlock>

            {structure.map((category, blockIndex) => (
                <StatBlock 
                    key={category.key}
                    index={index} 
                    isEven={isEven(blockIndex + 1)}
                    className="gap-2 overflow-y-auto"
                    rowCount={category.rowCount}
                >
                    {renderStatBlockContent(category as Category)}
                </StatBlock>
            ))}
        </div>
    );
}
