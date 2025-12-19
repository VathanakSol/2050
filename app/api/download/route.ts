// Set allowed host of R2
function getAllowedHosts() {
    const hosts = [];
    
    // Add R2 public URL hostname
    if (process.env.R2_PUBLIC_URL) {
        try {
            const publicUrl = new URL(process.env.R2_PUBLIC_URL);
            hosts.push(publicUrl.hostname);
        } catch {
            console.warn('Invalid R2_PUBLIC_URL format');
        }
    }
    
    // Add R2 endpoint hostname
    if (process.env.R2_ENDPOINT) {
        try {
            const endpointUrl = new URL(process.env.R2_ENDPOINT);
            hosts.push(endpointUrl.hostname);
        } catch {
            console.warn('Invalid R2_ENDPOINT format');
        }
    }
    
    return hosts;
}

function isAllowedUrl(url: string) {
    try {
        const parsed = new URL(url);
        if (parsed.protocol !== 'https:') return false;
        
        const allowedHosts = getAllowedHosts();
        if (allowedHosts.length === 0) {
            console.warn('No allowed hosts configured');
            return false;
        }
        
        if (!allowedHosts.includes(parsed.hostname)) return false;
        return true;
    } catch {
        return false;
    }
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const imageUrl = searchParams.get('url');

        if (!imageUrl) {
            return new Response('Missing image URL', { status: 400 });
        }

        // SSRF protection
        if (!isAllowedUrl(imageUrl)) {
            return new Response('Blocked URL', { status: 403 });
        }

        const response = await fetch(imageUrl);
        
        if (!response.ok) {
            return new Response('Failed to fetch image', {
                status: response.status,
            });
        }

        return new Response(response.body, {
            headers: {
                'Content-Type': response.headers.get('Content-Type') ?? 'image/jpeg',
                'Content-Disposition': 'attachment',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
        });
    } catch (error) {
        console.error('Download error:', error);
        return new Response('Download failed', { status: 500 });
    }
}

export async function OPTIONS() {
    return new Response(null, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
    });
}
