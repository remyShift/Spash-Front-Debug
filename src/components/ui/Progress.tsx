interface ProgressProps {
    value: number;
    label: string;
}

export function Progress({ value, label }: ProgressProps) {
    return (
        <div className="w-full">
            <div className="flex justify-between mb-1">
                <span className="text-sm text-white">{label}</span>
                <span className="text-sm text-white">{Math.round(value)}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${value}%` }}
                />
            </div>
        </div>
    );
} 