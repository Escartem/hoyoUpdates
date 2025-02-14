"use client";

import { useState } from "react";
import GameInfos from "@/components/browse/game-infos";
import GameList from "@/components/browse/game-list";
import StartPage from "@/components/browse/start-page";
import Background from "@/components/background";

export default function Home() {
	// use all states in root and pass down as props (useful ?)
	const [appState, setAppState] = useState(1);
	const [launcherId, setLauncherId] = useState("VYTpXlbWo8");
	const [games, setGames] = useState([]);
	const [selectedGame, setSelectedGame] = useState("");
	const [background, setBackground] = useState("/background.webp");

	return (
		<>
			<div className="w-full h-full bg-[#1a1a1a] flex items-center justify-center flex-col p-2">
				{(appState === 0 || appState === -1) && <StartPage setLauncherId={setLauncherId} appState={appState} setState={setAppState} />}
				{appState === 1 && <GameList launcherId={launcherId} games={games} setGames={setGames} setSelectedGame={setSelectedGame} setAppState={setAppState} setBackground={setBackground} />}
				{appState === 2 && <GameInfos setAppState={setAppState} launcherId={launcherId} selectedGame={selectedGame} games={games} setBackground={setBackground} />}

				<Background url={background} />
			</div>
		</>
	);
}


