"use client";

import { OctagonAlert, X } from "lucide-react";
import { useState } from "react";

export default function GlobalWarning() {
    const [open, setOpen] = useState(true);

    const textColor = "text-black";

    return (
        <div className={`absolute z-[900] w-full h-[30px] bg-red-400 flex items-center justify-center p-2 transition ${!open && "translate-y-[-100%] opacity-0"}`}>
            <div className="w-full flex text-sm md:text-xl items-center">
                <OctagonAlert className={`${textColor} mr-2`} />
                <p className={textColor}>Genshin and ZZZ won&apos;t receive latest updates for now due to a change in the update mechanism &lt;(＿　＿)&gt;</p>
            </div>
            <X onClick={() => {setOpen(false)}} className={`${textColor} hover:cursor-pointer`} />
        </div>
    )
}