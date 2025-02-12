import { useEffect, useState } from "react";
import { Container, Line, Loader } from "@/components/misc";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PackagesRenderer from "@/components/packages-renderer";
import { BButton } from "@/components/buttons";
import Image from "next/image";

export default function GameInfos({setAppState, launcherId, selectedGame, games, setBackground}: {setAppState: (state: number) => void, launcherId: string, selectedGame: string, games: any, setBackground: (url: string) => void}) {
	const [gameInfos, setGameInfos] = useState<any>([]);
	const [noAudio, setNoAudio] = useState(false);

	const audioHelp = [["english", "en-us"], ["chinese", "zh-cn"], ["japanese", "ja-jp"], ["korean", "ko-kr"]];

	useEffect(() => {
		if (gameInfos.length !== 0) return;
		fetch(`/api/getInfos?launcher=${launcherId}&game=${games[0][selectedGame].id}`)
		.then(res => res.json())
		.then(data => setGameInfos(data))
		.catch(err => console.error(err));
	}, [])

	useEffect(() => {
		if (gameInfos.length === 0) return;
		if (Object.keys(gameInfos[0].current.major.audio_pkgs).length === 0) {
			setNoAudio(true);
		}
	})

	const goBack = () => {
		// lazy to clear selected game
		setBackground("/background.webp");
		setAppState(1);
	}

	return (
		<Container>
			{gameInfos.length === 0 && (
				<Loader />
			)}

			{gameInfos.length !== 0 && (
				<>
					<div className="flex items-center w-full justify-center">
						<Image className="rounded-md mr-2 pointer-events-none" src={games[0][selectedGame].icon} width={32} height={32} alt="game icon"></Image>
						<span className="bold underline text-2xl">{games[0][selectedGame].name}</span>
					</div>

					<Line />

					<Tabs defaultValue="full" className="w-full">
						<div className="w-full flex items-center justify-center">
							<TabsList className="border-2 border-neutral-700">
								<TabsTrigger value="full">Live game</TabsTrigger>

								{gameInfos[0].current.patches.map((e: any, i: number) => (
									<TabsTrigger value={`update-${i}`}>{gameInfos[0].current.patches[i].version} -&gt; {gameInfos[0].current.major.version}</TabsTrigger>
								))}
							</TabsList>
						</div>

						<TabsContent value="full">
							<>
								<Tabs defaultValue="game" className="w-full">
									<div className="w-full flex items-center justify-center">
										<TabsList className="border-2 border-neutral-700 overflow-x-auto overflow-y-hidden">
											<TabsTrigger value="game">Base game</TabsTrigger>
											{!noAudio && (
												<>
													<TabsTrigger value="english">English</TabsTrigger>
													<TabsTrigger value="chinese">Chinese</TabsTrigger>
													<TabsTrigger value="japanese">Japanese</TabsTrigger>
													<TabsTrigger value="korean">Korean</TabsTrigger>
												</>
											)}
										</TabsList>
									</div>

									<Line />

									<TabsContent value="game">
										<PackagesRenderer packages={gameInfos[0].current.major.game_pkgs} version={gameInfos[0].current.major.version} />
									</TabsContent>

									{!noAudio && (
										<>
											{audioHelp.map((e: any) => (
												<TabsContent value={e[0]}>
													<PackagesRenderer packages={[gameInfos[0].current.major.audio_pkgs[e[1]]]} version={gameInfos[0].current.major.version} />
												</TabsContent>
											))}
										</>
									)}
								</Tabs>
							</>
						</TabsContent>

						{gameInfos[0].current.patches.map((e: any, i: number) => (
							<TabsContent value={`update-${i}`}>
								<>
									<Tabs defaultValue="game" className="w-full">
										<div className="w-full flex items-center justify-center">
											<TabsList className="border-2 border-neutral-700">
												<TabsTrigger value="game">Base game</TabsTrigger>
												{!noAudio && (
													<>
														<TabsTrigger value="english">English</TabsTrigger>
														<TabsTrigger value="chinese">Chinese</TabsTrigger>
														<TabsTrigger value="japanese">Japanese</TabsTrigger>
														<TabsTrigger value="korean">Korean</TabsTrigger>
													</>
												)}
											</TabsList>
										</div>

										<Line />

										<TabsContent value="game">
											<PackagesRenderer packages={gameInfos[0].current.patches[i].game_pkgs} version={gameInfos[0].current.patches[i].version} />
										</TabsContent>

										{!noAudio && (
											<>
												{audioHelp.map((e: any) => (
													<TabsContent value={e[0]}>
														<PackagesRenderer packages={[gameInfos[0].current.patches[i].audio_pkgs[e[1]]]} version={gameInfos[0].current.patches[i].version} />
													</TabsContent>
												))}
											</>
										)}
									</Tabs>
								</>
							</TabsContent>
						))}

					</Tabs>

					<Line />
					
					<BButton callback={goBack} text="Go back to game list" />
				</>
			)}
		</Container>
	)
}