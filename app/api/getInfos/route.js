export async function GET(request) {
	const { searchParams } = new URL(request.url);
	let launcherId = searchParams.get("launcher");
    let gameId = searchParams.get("game");

	const res = await fetch(`https://sg-hyp-api.hoyoverse.com/hyp/hyp-connect/api/getGamePackages?game_ids[]=${gameId}&launcher_id=${launcherId}`)
	.catch(error => {return new Response(error)})

    const data = await res.json()

    if (data.retcode !== 0) {
        return new Response(JSON.stringify({}));
    }

    let output = [{}]

    // process packages
    output[0]["current"] = data.data.game_packages[0].main
    output[0]["pre_download"] = data.data.game_packages[0].pre_download

    // redo audio for better processing
    function convertAudioPkgs(data) {
        let result = {};
        data.forEach(pkg => {
            result[pkg.language] = {
                url: pkg.url,
                md5: pkg.md5,
                size: pkg.size,
                decompressed_size: pkg.decompressed_size
            };
        });
        return result;
    }

    output[0]["current"]["major"]["audio_pkgs"] = convertAudioPkgs(output[0]["current"]["major"]["audio_pkgs"])
    output[0]["current"]["patches"].forEach(patch => {
        patch["audio_pkgs"] = convertAudioPkgs(patch["audio_pkgs"])
    });

    function removeResListUrl(obj) {
        if (typeof obj !== "object" || obj === null) return obj;
        if (Array.isArray(obj)) return obj.map(removeResListUrl);
    
        const newObj = {};
        for (const key in obj) {
            if (key !== "res_list_url") {
                newObj[key] = removeResListUrl(obj[key]);
            }
        }
        return newObj;
    }

    output = removeResListUrl(output); // i don't like em

    return new Response(JSON.stringify(output));
}
