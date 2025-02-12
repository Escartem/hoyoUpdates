import { Button } from "./ui/button";

// i just can't decide myself between using a button, div, span for clickable elements, don't judge me

export function BButton({callback, text, disabled}: {callback: () => void, text: string, disabled?: boolean}) {
    return (
        <>
            <Button disabled={disabled} onClick={callback} className="w-full hover:brightness-[1.3] transition border-2 border-neutral-700" variant={"secondary"}>{text}</Button>
        </>
    )
}

export function DButton({callback, children}: {callback: () => void, children: React.ReactNode}) {
    return (
        <>
            <div onClick={callback} className="border-2 border-neutral-600 hover:border-neutral-400 hover:cursor-pointer transition p-2 rounded-md flex items-center mb-2">
                {children}
            </div>
        </>
    )
}