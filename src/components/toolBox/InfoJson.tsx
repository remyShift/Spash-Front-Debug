import { JSONInfo } from "@/types/files";

export default function InfoJson({ jsonInfo }: { jsonInfo: JSONInfo }) {
    return (
        <div className="p-4 max-h-[500px] hide-scrollbar overflow-y-auto">
            <pre className="text-white">{JSON.stringify(jsonInfo, null, 2)}</pre>
        </div>
    )
}
