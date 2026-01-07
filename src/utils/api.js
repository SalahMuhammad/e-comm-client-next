import { getServerAuthToken } from "./serverCookieHandelr";


const BASE_URL = process.env.API_URL || 'http://localhost:8000';

export async function apiRequest(endpoint, options = {}) {
    const url = `${BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    const headersss = { ...options.headers }
    delete options['headers']
    let response;
    try {
        response = await fetch(url, {
            headers: {
                "auth": await getServerAuthToken(),
                ...headersss,

            },
            // 'credentials': 'include',  // Important for cookies
            // cache: 'no-store', // 'force-cache', // or 'no-store' for dynamic data
            // next: { revalidate: 3600 }, // revalidate every hour
            ...options,
        });

        // If response is a blob, return a different structure
        if (options.blob) {
            const blob = await response.blob();
            return {
                status: response.status,
                ok: response.ok,
                blob,
                headers: response.headers,
            };
        }

        // Normal JSON response handling
        const data = await response?.json().catch(() => ({}))
        return {
            status: response?.status || 0,
            ok: response?.ok || false,
            data
        }
    } catch (error) {
        console.error('API Request failed: ', error);
        return {
            status: 0,
            ok: false,
            data: {},
            error
        }
    }
}
