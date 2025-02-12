import { convertSize } from "@/lib/helpers";

export default function PackagesRenderer({packages, version}: {packages: any, version: string}) {
    const sum = (arr: any, off: string) => arr.map((e: any) => e[off]).reduce((a: any, b: any) => a + parseInt(b), 0);
    
    return (
        <>
            <ul>
                <li>• Version : {version}</li>
                <li>• Total download : {convertSize(sum(packages, "size"))}</li>
                {/* uncompressed size seem to be just the size the games asks to install the update, not the size of the extracted data from zip, so it's irrelevant */}
                {/* <li>• Total uncompressed size (todo: remove) : {convertSize(sum(packages, "decompressed_size"))}</li> */}
            </ul>

            <hr className="bg-white/20 m-4 rounded-md border-0 h-[2px]" />
            
            <div className="grid grid-cols-3 gap-2 mt-2 mb-2">
                {packages.map((e: any, i: number) => (
                    <a key={i} target="_blank" className="border-2 border-neutral-600 hover:border-neutral-400 hover:cursor-pointer transition p-2 rounded-md" href={e.url}>
                        #{i+1} - {convertSize(e.size)}
                    </a>
                ))}
            </div>
        </>
    )
}