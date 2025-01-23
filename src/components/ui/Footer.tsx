
export default function Footer() {
    return (
        <div className="h-12 flex justify-center items-center gap-1">
            <p className="text-sm text-gray-300">
                Made with ❤️ by
            </p>
            <a href="https://www.remyshift.dev" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                remyShift
            </a>
        </div>
    );
}