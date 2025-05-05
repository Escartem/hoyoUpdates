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
		if (Object.keys(gameInfos[0].current.major?.audio_pkgs || {}).length === 0) {
			setNoAudio(true);
		}
	}, [gameInfos])

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

					{gameInfos[0].current.major == null && (
						<div className="flex items-center w-full justify-center">
							<span className="bold text-xl">No data ⊙﹏⊙∥</span>
						</div>
					)}

					{gameInfos[0].current.major != null && (
						<Tabs defaultValue="current" className="w-full">
							{
								gameInfos[0].pre_download.major != null && (
									<div className="w-full flex items-center justify-center">
										<TabsList className="border-2 border-neutral-700">
											<TabsTrigger value="current">Current version</TabsTrigger>
											<TabsTrigger value="pre">Pre-download</TabsTrigger>
										</TabsList>
									</div>
								)
							}

							<TabsContent value="current">
								<DisplayTabs gameInfos={gameInfos} noAudio={noAudio} audioHelp={audioHelp} isPre={false} />
							</TabsContent>
							<TabsContent value="pre">
								<DisplayTabs gameInfos={gameInfos} noAudio={noAudio} audioHelp={audioHelp} isPre={true} />
							</TabsContent>
						</Tabs>
					)}

					

					<Line />
					
					<BButton callback={goBack} text="Go back to game list" />
				</>
			)}
		</Container>
	)
}

function DisplayTabs({gameInfos, noAudio, audioHelp, isPre}: {gameInfos: any, noAudio: boolean, audioHelp: any, isPre: boolean}) {
	const infos = isPre ? gameInfos[0].pre_download : gameInfos[0].current;
	
	return (
		<>
			<Tabs defaultValue="full" className="w-full">
				<div className="w-full flex items-center justify-center">
					<TabsList className="border-2 border-neutral-700">
						<TabsTrigger value="full">Live game</TabsTrigger>

						{infos.patches.map((e: any, i: number) => (
							<TabsTrigger key={i} value={`update-${i}`}>{infos.patches[i].version} -&gt; {infos.major.version}</TabsTrigger>
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
								<PackagesRenderer packages={infos.major.game_pkgs} version={infos.major.version} />
							</TabsContent>

							{!noAudio && (
								<>
									{audioHelp.map((e: any) => (
										<TabsContent key={e[0]} value={e[0]}>
											<PackagesRenderer packages={[infos.major.audio_pkgs[e[1]]]} version={infos.major.version} />
										</TabsContent>
									))}
								</>
							)}
						</Tabs>
					</>
				</TabsContent>

				{infos.patches.map((e: any, i: number) => (
					<TabsContent key={i} value={`update-${i}`}>
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
									<PackagesRenderer packages={infos.patches[i].game_pkgs} version={infos.patches[i].version} />
								</TabsContent>

								{!noAudio && (
									<>
										{audioHelp.map((e: any) => (
											<TabsContent key={e[0]} value={e[0]}>
												<PackagesRenderer packages={[infos.patches[i].audio_pkgs[e[1]]]} version={infos.patches[i].version} />
											</TabsContent>
										))}
									</>
								)}
							</Tabs>
						</>
					</TabsContent>
				))}
			</Tabs>
		</>
	)
}