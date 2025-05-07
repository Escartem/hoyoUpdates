import { convertSize } from "@/lib/helpers";
import { FolderArchive } from "lucide-react";
import { Tooltip } from "react-tooltip";

export default function PackagesRenderer({packages, version, sophon}: {packages: any, version: string, sophon?: boolean}) {
    const sum = (arr: any, off: string) => arr.map((e: any) => e[off]).reduce((a: any, b: any) => a + parseInt(b), 0);
    
    return (
        <>
            <ul>
                <li>• Version : {version}</li>
                {!sophon && (<li>• Total download : {convertSize(sum(packages, "size"))}</li>)}
                {/* uncompressed size seem to be just the size the games asks to install the update, not the size of the extracted data from zip, so it's irrelevant */}
                {/* <li>• Total uncompressed size (todo: remove) : {convertSize(sum(packages, "decompressed_size"))}</li> */}
            </ul>

            <hr className="bg-white/20 m-4 rounded-md border-0 h-[2px]" />

            {sophon && (
                <>
                    <span>This is a sophon package, in order to download the file, please use <a className="underline" href="https://github.com/Escartem/SophonDownloader">SophonDownloader</a> and run it using :</span>
                    <div className="p-2 select-all mt-2 bg-[#1a1a1a] rounded-md border-2 border-white/20 w-full overflow-x-auto text-nowrap">
                        <span className="w-full font-mono">{`Sophon.Downloader.exe ${packages[0][0]} ${version} ${packages[0][1]} output --matchingField=${packages[0][2]}`}</span>
                    </div>
                </>
            )}

            {!sophon && (
                <>
                    <Tooltip className="select-none" id="md5" />

                    <div className="grid grid-cols-3 gap-2 mt-2 mb-2">
                        {packages.map((e: any, i: number) => (
                            <a key={i} target="_blank" className="flex text-sm items-center border-2 border-neutral-600 hover:border-neutral-400 hover:cursor-pointer transition p-2 rounded-md" href={e.url} data-tooltip-id="md5" data-tooltip-content={`MD5 : ${e.md5.toLowerCase()}`}>
                                <FolderArchive className="mr-1" />
                                n°{i+1} ({convertSize(e.size)})
                            </a>
                        ))}
                    </div>
                </>
            )}
        </>
    )
}