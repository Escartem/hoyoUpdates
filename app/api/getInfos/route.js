import { data } from "framer-motion/client";

export async function GET(request) {
	const { searchParams } = new URL(request.url);
	let launcherId = searchParams.get("launcher");
    let gameId = searchParams.get("game");

    const sophonGames = [
        "gopR6Cufr3" // hk4e
    ]

    var sophon = false;

    let url = `https://sg-hyp-api.hoyoverse.com/hyp/hyp-connect/api/getGamePackages?game_ids[]=${gameId}&launcher_id=${launcherId}`;
    if (sophonGames.includes(gameId)) {
        sophon = true;
        url = `https://sg-hyp-api.hoyoverse.com/hyp/hyp-connect/api/getGameBranches?game_ids[]=${gameId}&launcher_id=${launcherId}`;
    }

	const res = await fetch(url)
	.catch(error => {return new Response(error)})

    let data = await res.json()

    if (data.retcode !== 0) {
        return new Response(JSON.stringify({}));
    }

    let output = [{
        "sophon": false,
        "current": null,
        "pre_download": null
    }]

    //sophon
    if (sophon) {
        // hardcoded lmao, too lazy to fix my code to make it dynamic
        let latestTag = data.data.game_branches[0].main.tag;
        latestTag = latestTag.replace(/(\d+\.\d+)\.\d+$/, "$1"); // remove patch number

        let sophonData = [{
            "sophon": true,
            "current": {
                "major": {
                    "version": latestTag,
                    "game_pkgs": [[gameId, latestTag, "game", "full"]],
                    "audio_pkgs": {
                        "en-us": [gameId, latestTag, "en-us", "full"],
                        "ja-jp": [gameId, latestTag, "ja-jp", "full"],
                        "ko-kr": [gameId, latestTag, "ko-kr", "full"],
                        "zh-cn": [gameId, latestTag, "zh-cn", "full"]
                    }
                },
                "patches": []
            },
            "pre_download": {
                "major": null,
                "patches": []
            }
        }];

        for (const elem of data.data.game_branches[0].main.diff_tags) {
            let patch = {
                "version": elem.replace(/(\d+\.\d+)\.\d+$/, "$1"),
                "game_pkgs": [[gameId, latestTag, "game", "update"]],
                "audio_pkgs": {
                    "en-us": [gameId, latestTag, "en-us", "update"],
                    "ja-jp": [gameId, latestTag, "ja-jp", "update"],
                    "ko-kr": [gameId, latestTag, "ko-kr", "update"],
                    "zh-cn": [gameId, latestTag, "zh-cn", "update"],
                }
            }

            sophonData[0].current.patches.push(patch);
        }

        return new Response(JSON.stringify(sophonData));
    }

    // update versions
    function modifyVersions(obj) {
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (key === "version" && typeof obj[key] === "string") {
                    obj[key] = obj[key].replace(/(\d+\.\d+)\.\d+$/, "$1");
                } else if (typeof obj[key] === "object") {
                    modifyVersions(obj[key]);
                }
            }
        }
        return obj;
    }

    data = modifyVersions(data)

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

    if (output[0]["pre_download"]["major"] != undefined) {
        output[0]["pre_download"]["major"]["audio_pkgs"] = convertAudioPkgs(output[0]["pre_download"]["major"]["audio_pkgs"])
        output[0]["pre_download"]["patches"].forEach(patch => {
            patch["audio_pkgs"] = convertAudioPkgs(patch["audio_pkgs"])
        });
    }
    

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
