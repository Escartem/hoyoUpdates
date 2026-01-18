"use client";

import { Loader } from "@/components/misc";
import { useCallback, useEffect, useState } from "react"
import { fetch } from '@tauri-apps/plugin-http';
const { init, compress, decompress } = require('@bokuweb/zstd-wasm');

export default function BrowseGame() {
    const [isLoading, setIsLoading] = useState(true);

    const testURL = "https://autopatchhk.yuanshen.com/client_app/sophon/manifests/cxhpq4g4rgg0/d6lo39gA1LIA/manifest_5c3b9426a2f209d1_3934c9f0cc2b5ef1b468bad832be87bb"
    const { progress, data, startDownload } = useDownloadWithProgress(testURL);

    useEffect(() => {
        startDownload();
        if (progress == 1) {
            console.log(data);
        }
    }, []);
    
    return (
        <>
            <div className="bg-[#2f2f2f] w-full h-full">
                {isLoading ? (
                    <div className="w-full h-full flex items-center justify-center">
                        <Loader />
                        <span>{Math.round(progress*100)}%</span>
                    </div>
                ) : (
                    <></>
                )}
            </div>
        </>
    )
}

function useDownloadWithProgress(url: string) {
    const [progress, setProgress] = useState(0);
    const [data, setData] = useState<Blob | null>(null);

    const startDownload = useCallback(async () => {
        await init();
        const res = await fetch(url);
        const reader = res.body?.getReader();
        const contentLength = +res.headers.get("Content-Length")!;
        let received = 0;
        const chunks: Uint8Array[] = [];

        while (true) {
            const { done, value } = await reader!.read();
            if (done) break;
            chunks.push(value);
            received += value.length;
            setProgress(received / contentLength);
        }

        const compressed = new Uint8Array(received);
        let offset = 0;
        for (const chunk of chunks) {
            compressed.set(chunk, offset);
            offset += chunk.length;
        }

        const decompressed = decompress(compressed);
        setData(new Blob([decompressed]));
    }, [url]);

    return { progress, data, startDownload };
}