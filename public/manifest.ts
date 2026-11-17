import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "My App",
        short_name: "My App",
        description: "My web application",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#ffffff",
        icons: [
            {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
    }
        ]

    }
}