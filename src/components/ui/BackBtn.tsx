import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

export default function BackBtn() {
    return (
        <div className="w-fit h-full">
            <Link href="/" className="flex items-center justify-center text-primary transition-all duration-300 group cursor-pointer">
                <FontAwesomeIcon icon={faArrowLeft} />
            </Link>
        </div>
    )
}
