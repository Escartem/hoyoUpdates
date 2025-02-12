import { Github, Loader2 } from "lucide-react"

export function Line() {
    // yes, it's just a line

    return (
        <>
            <hr className="bg-white/20 m-4 rounded-md border-0 h-[2px]" />
        </>
    )
}

export function Loader() {
    return (
        <>
            <span className="flex items-center text-xl opacity-[65%]"><Loader2 className="mr-2 transition animate-spin w-[24px] h-[24px]"></Loader2> Loading...</span>
        </>
    )
}

export function Header() {
    return (
        <>
            <div className="flex items-center mb-2">
                <h1 className="bold text-2xl">HoyoUpdates •</h1>
                <a className="ml-1 mr-1 transition opacity-[45%] hover:opacity-[90%]" target="_blank" href="https://github.com/Escartem/HoyoUpdates"><Github /></a>
                <span className="bold text-2xl">•</span>
                <span className="ml-2 text-white/30">v{process.env.NEXT_PUBLIC_APP_VERSION}</span>
            </div>
            
            <Line />
        </>
    )
}

export function Container({children}: {children: React.ReactNode}) {
    return (
        <>
            <div className="z-[1] w-full max-w-[500px] bg-[#2f2f2f] p-6 rounded-md border-2 border-neutral-600 shadow-2xl backdrop-blur-[7px]">
                <Header />

                {children}
            </div>
        </>
    )
}