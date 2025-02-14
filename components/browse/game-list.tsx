import { useEffect } from "react";
import { Container, Line, Loader } from "@/components/misc";
import { BButton, DButton } from "@/components/buttons";
import Image from "next/image";

export default function GameList({launcherId, games, setGames, setSelectedGame, setAppState, setBackground}: {launcherId: string, games: any, setGames: (games: any) => void, setSelectedGame: (game: string) => void, setAppState: (state: number) => void, setBackground: (url: string) => void}) {
	useEffect(() => {
		if (games.length !== 0) return;
		fetch(`/api/getGames?launcher=${launcherId}`)
		.then(res => res.json())
		.then(data => {
			if (Object.keys(data).length === 0) {
				setAppState(-1);
				return;
			}

			setGames(data);
		})
		.catch(err => console.error(err));
	}, [])

	const handleClick = (game: string) => {
		setBackground(games[0][game].background);
		setSelectedGame(game);
		setAppState(2);
	}

	const goBack = () => {
		setGames([]); // clearing games will make redo request, no need to reset launcher id
		setAppState(0);
	}

	return (
		<Container>
			{games.length === 0 && (
				<Loader />
			)}

			{games.length !== 0 && (
				<>
					<span className="opacity-[65%] block mb-2">A simple web tool to retrieve all updates links of hoyo games. To begin, please select the game you need bellow~</span>
					
					{Object.entries(games[0]).map((e: any) => (
						<DButton key={e[0]} callback={() => {handleClick(e[0])}}>
							<Image className="rounded-md mr-2 pointer-events-none" src={e[1].icon} width={32} height={32} alt="game icon"></Image>
							<span>{e[1].name}</span>
						</DButton>
					))}

					<Line />

					<BButton callback={goBack} text="Change launcher id" />
				</>
			)}
		</Container>
	)
}