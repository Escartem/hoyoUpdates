import { ChevronLeft, GitCommitVertical, LoaderCircle } from "lucide-react";
import { Container, Line, Loader } from "../misc";
import Image from "next/image";
import { BButton } from "../buttons";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function GameVersions({setAppState, selectedGame, games, gameInfos}: {setAppState: (state: number) => void, selectedGame: string, games: any, gameInfos: any}) {
    const [isRedirect, setIsRedirect] = useState("");
    const router = useRouter();
    
    const lowestVersions: any = {
        "nap_global": ["1.2", 7],
        "hk4e_global": ["4.2", 8],
        "hkrpg_global": ["3.2", 8]
    };

    const low = lowestVersions[selectedGame];
    const versionList = generateSteps(low[0], gameInfos[0].current.major.version, low[1]).reverse();

    const goBack = () => {
        setAppState(2);
    }

    const openBrowser = (id: any) => {
        setIsRedirect(id);
        router.push(`/browse?g=${selectedGame}&v=${id}`);
    }

    return (
        <Container>
            <div className="flex items-center w-full justify-center">
                <Image className="rounded-md mr-2 pointer-events-none" src={games[0][selectedGame].icon} width={32} height={32} alt="game icon"></Image>
                <span className="bold underline text-2xl">{games[0][selectedGame].name}</span>
            </div>

            <Line />

            <span className="opacity-[65%] block mb-2">Select the version of your choice here, after you will be able to browse all the game files and download the ones you want individually~</span>

            <Line />

            <div className="grid grid-cols-3 gap-2 mt-2 mb-2">
                {versionList.map((e: any, i: number) => (
                    <a onClick={() => {openBrowser(e)}} key={i} target="_blank" className={`flex text-md font-bold items-center border-2 border-neutral-600 hover:border-neutral-400 hover:cursor-pointer transition p-2 rounded-md ${isRedirect == e && "bg-neutral-900"}`} >
                        {isRedirect == e ? (<LoaderCircle className="transition animate-spin mr-1" />) : (<GitCommitVertical className="mr-1" />)}
                        {e}
                    </a>
                ))}
            </div>

            <Line />

            <BButton callback={goBack}>
                <ChevronLeft />
                Go back
            </BButton>
        </Container>
    )
}

function generateSteps(start: string, end: string, low: number): string[] {
    const result: string[] = [];
    let [sInt, sDec] = start.split('.').map(Number);
    const [eInt, eDec] = end.split('.').map(Number);

    while (sInt < eInt || (sInt === eInt && sDec <= eDec)) {
        result.push(`${sInt}.${sDec}`);
        sDec += 1;
        if (sDec > low) {
            sDec = 0;
            sInt += 1;
        }
    }

    return result;
}