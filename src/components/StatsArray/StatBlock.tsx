import React, { useState, useRef, useEffect } from "react"

interface StatBlockProps {
    index: number
    isEven: boolean 
    children: React.ReactNode
    className?: string
    rowCount?: number
}

export default function StatBlock ({ isEven, children, className = "", rowCount = 1 }: StatBlockProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    const baseHeight = 40;
    const height = rowCount * baseHeight;

    useEffect(() => {
        if (videoRef.current) {
            if (isExpanded) {
                videoRef.current.style.height = 'auto';
            } else {
                videoRef.current.style.height = `${height}px`;
            }
        }
    }, [isExpanded, height]);

    return (
        <div 
            className={`w-28 md:w-36 lg:w-52 rounded-lg ${isExpanded ? 'h-auto' : `h-[${height}px]`} ${isEven ? "bg-lightBackground" : "bg-lighterBackground"} cursor-pointer-none transition-all duration-300 flex flex-col justify-center items-center hide-scrollbar ${className}`} 
            onClick={toggleExpand}
            style={{ minHeight: isExpanded ? 'auto' : `${height}px` }}
        >
            {React.Children.map(children, child => {
                if (React.isValidElement(child) && child.type === 'video') {
                    return React.cloneElement(child, {
                        ref: videoRef,
                        className: `w-full object-cover transition-all cursor-pointer duration-300 ${isExpanded ? 'h-auto' : `h-[${height}px]`}`
                    } as React.ComponentProps<'video'>);
                }
                return child;
            })}
        </div>
    );
}