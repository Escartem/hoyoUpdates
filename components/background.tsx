"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Background({ url }: { url: string }) {
	const [src, setSrc] = useState(url);
	const [nextSrc, setNextSrc] = useState<string | null>(null);
	const [loaded, setLoaded] = useState(true);

	useEffect(() => {
		if (url !== src) {
			setLoaded(false);
			const img = new Image();
			img.src = url;
			img.onload = () => {
				setNextSrc(url);
				setLoaded(true);
			};
		}
	}, [url, src]);

	return (
		<div className="absolute z-[0] w-full h-full pointer-events-none saturate-[0.4] blur-[3px] opacity-[0.6]">
			<motion.img
				key={src}
				src={src}
				className="absolute z-[0] inset-0 w-full h-full object-cover"
				initial={{ opacity: 1 }}
				animate={{ opacity: nextSrc ? 0 : 1 }}
				transition={{ duration: 0.5 }}
				onAnimationComplete={() => {
					if (nextSrc) {
						setSrc(nextSrc);
						setNextSrc(null);
					}
				}}
			/>
			{nextSrc && loaded && (
				<motion.img
					key={nextSrc}
					src={nextSrc}
					className="absolute z-[0] inset-0 w-full h-full object-cover"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.5 }}
				/>
			)}
		</div>
	);
}
