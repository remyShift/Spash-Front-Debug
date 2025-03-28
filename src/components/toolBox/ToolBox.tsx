import { JSONData } from "@/types/files";
import ToolBoxControls from "./toolboxControls/ToolBoxControls";
import Accordion from "@/components/ui/accordion/Accordion";
import Spacer from "../ui/Spacer";

export default function ToolBox({ videoData }: { videoData: JSONData }) {
    return (
        <div className="flex flex-col w-full lg:w-1/4">
            <div className="w-fit px-3 h-8 bg-primary rounded-t-md flex items-center justify-center">
                <p className="text-white font-semibold text-base">Tools</p>
            </div>

            <div className="w-full bg-lightBackground rounded-tr-lg rounded-b-lg">
                <div className="flex flex-col gap-0 w-full">
                    <ToolBoxControls videoData={videoData} />
                    <Spacer />
                    <Accordion videoData={videoData} />
                </div>
            </div>
        </div>
    )
}
