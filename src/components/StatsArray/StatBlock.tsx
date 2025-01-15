import { useState } from "react"

interface StatBlockProps {
    index: number
    isEven: boolean 
    children: React.ReactNode
    className?: string
}
export default function StatBlock ({ isEven, children, className = "" }: StatBlockProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div className={`w-52 ${isExpanded ? 'h-auto' : 'h-32'} rounded-lg ${isEven ? "bg-lightBackground" : "bg-lighterBackground"} flex flex-col transition-all duration-300 cursor-pointer justify-center items-center hide-scrollbar ${className}`} onClick={toggleExpand}>
            {children}
        </div>
    )
}