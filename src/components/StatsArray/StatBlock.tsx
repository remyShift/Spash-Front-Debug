import { useState } from "react"

interface StatBlockProps {
    index: number
    isEven: boolean 
    children: React.ReactNode
    className?: string
    rowCount?: number
}

export default function StatBlock ({ isEven, children, className = "", rowCount = 1 }: StatBlockProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    const baseHeight = 40; // Hauteur de base pour une ligne
    const height = rowCount * baseHeight;

    return (
        <div 
            className={`w-52 rounded-lg ${isExpanded ? 'h-auto' : `h-[${height}px]`} ${isEven ? "bg-lightBackground" : "bg-lighterBackground"} flex flex-col transition-all duration-300 cursor-pointer justify-center items-center hide-scrollbar ${className}`} 
            onClick={toggleExpand}
            style={{ minHeight: isExpanded ? 'auto' : `${height}px` }}
        >
            {children}
        </div>
    )
}