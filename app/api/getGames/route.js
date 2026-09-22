export async function GET(request) {
	const { searchParams } = new URL(request.url);
	let launcherId = searchParams.get("launcher");

	const res = await fetch(`https://sg-hyp-api.hoyoverse.com/hyp/hyp-connect/api/getGames?launcher_id=${launcherId}&language=en-us`)
	.catch(error => {return new Response(error)})

    const data = await res.json()

    if (data.retcode !== 0) {
        return new Response(JSON.stringify({}));
    }

    // format data
    let output = [{}]
    const skippedGames = [
        "viiywh5G2H", // hyg
        "yneO4yGc4x", // abs
    ]

    for (const game of data.data.games) {
        if (!skippedGames.includes(game.id)) {
            output[0][game.biz] = {
                id: game.id,
                name: game.display.name,
                icon: game.display.icon.url,
                background: game.display.background.url
            }
        }
    }

    return new Response(JSON.stringify(output));
}
