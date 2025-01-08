export default function ButtonLayer({ content, isActive, handleClick }: { content: string, isActive: boolean, handleClick: () => void }) {
    return (
        <button className={`w-fit px-3 h-8 bg-primary rounded-t-md text-white font-semibold text-base ${isActive ? "opacity-100" : "opacity-50"}`}
            onClick={handleClick}
        >
            {content}
        </button>
    )
}
