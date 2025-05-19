"use client";

import { convertSize } from "@/lib/helpers";
import { Check, Copy, FolderArchive } from "lucide-react";
import { useState } from "react";
import { Tooltip } from "react-tooltip";

export default function PackagesRenderer({packages, version, sophon}: {packages: any, version: string, sophon?: boolean}) {
    const sum = (arr: any, off: string) => arr.map((e: any) => e[off]).reduce((a: any, b: any) => a + parseInt(b), 0);
    
    const [copy, setCopy] = useState(false);

    let sophonText = "";
    if (sophon) {
        if (packages[0][3] == "update") {
            sophonText = `Sophon.Downloader.exe ${packages[0][3]} ${packages[0][0]} ${packages[0][2]} ${version} ${packages[0][1]} output`;
        }
        else if (packages[0][3] == "full") {
            sophonText = `Sophon.Downloader.exe ${packages[0][3]} ${packages[0][0]} ${packages[0][2]} ${packages[0][1]} output`;
        }
    }

    const handleCopy = () => {
        try {
            navigator.clipboard.writeText(sophonText);
        } catch (err) {
            console.error("Failed to copy: ", err);
            return;
        }
        
        setCopy(true);
        setTimeout(() => {
            setCopy(false);
        }, 2000);
    }

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
                    <div className="flex items-center mt-2">
                        <div className="h-[48px] p-2 select-all bg-[#1a1a1a] rounded-tl-md rounded-bl-md border-2 border-white/20 w-full border-r-white/0 overflow-x-auto text-nowrap">
                            <span className="w-full font-mono text-white/80">{sophonText}</span>
                        </div>
                        <button onClick={handleCopy} disabled={copy} className="h-[48px] flex items-center justify-center text-white/40 hover:text-white/80 transition rounded-tr-md rounded-br-md border-2 border-white/20 aspect-square bg-[#1a1a1a]">
                            {copy ? (
                                <Check size={20} />
                            ) : (
                                <Copy size={20} />
                            )}
                        </button>
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