const isTauri = process.env.TAURI_BUILD === 'true';

module.exports = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "launcher-webstatic.hoyoverse.com",
                port: "",
            }
        ],
        unoptimized: true
    },
    output: isTauri ? 'export' : undefined,
}