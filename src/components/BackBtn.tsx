import Link from "next/link";

export default function BackBtn() {
    return (
        <div className="w-fit h-full">
            <Link href="/" className="flex items-center justify-center bg-white rounded-full w-12 h-12 hover:bg-black hover:text-white hover:border-white transition-all duration-300 group border border-black">
                <p className="text-black text-3xl font-bold pt-1 group-hover:text-white">&lt;</p>
            </Link>
        </div>
    )
}
