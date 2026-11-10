
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
    const imageUrl = request.nextUrl.searchParams.get('url');

    if (!imageUrl) {
        return new Response('Missing image URL', { status: 400 });
    }

    try {
        const url = new URL(imageUrl);

        const allowedHosts = [
    'scans-hot.planeptune.us',
    'hot.planeptune.us'
];

if (
    url.protocol !== 'https:' ||
    !allowedHosts.includes(url.hostname)
) {
    return new Response('Invalid image URL', { status: 400 });
}
        
console.log("Image hostname:", url.hostname);
console.log("Image URL:", imageUrl);
        

        const response = await fetch(url, {
            headers: {
                Referer: 'https://weebcentral.com/',
                'User-Agent': 'Mozilla/5.0'
            },
            cache: 'no-store'
        });

        if (!response.ok) {
            return new Response('Failed to fetch manga image', {
                status: response.status
            });
        }

        return new Response(response.body, {
            headers: {
                'Content-Type':
                    response.headers.get('content-type') || 'image/png',
                'Cache-Control': 'public, max-age=3600'
            }
        });
    } catch (error) {
        console.error('Image proxy error:', error);

        return new Response('Image proxy failed', { status: 500 });
    }
}
