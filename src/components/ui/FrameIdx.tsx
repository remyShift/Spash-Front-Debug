export default function FrameIdx({ frameIdx }: { frameIdx: number }) {
    return (
        <div className="absolute bottom-5 right-10 z-50 min-w-24 flex items-center p-2 bg-gray-800 rounded-md">
            <p className="text-white text-sm">Frame : {frameIdx}</p>
        </div>
    )
}
