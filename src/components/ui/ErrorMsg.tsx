export default function ErrorMsg({ error }: { error: string }) {
    return (
        <div className="flex items-center justify-center h-screen">
            <p className="text-red-500 font-semibold">{error}</p>
        </div>
    )
}