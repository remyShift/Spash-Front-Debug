interface StatTextProps {
    value: number | string
    label?: string
    playerColor?: string
}
export default function StatText ({ value, label, playerColor }: StatTextProps) {
    return (
        <p className={`text-center font-semibold ${playerColor || "text-white"}`}>
            {label && `${label}: `}{value}
        </p>
    )
}