import { getServerAuthToken } from "./serverCookieHandelr";

const BASE_URL = process.env.API_URL || 'http://localhost:8000';

export async function apiRequest(endpoint, options = {}) {
    const url = `${BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    // if (endpoint === '/auth/login/' || endpoint === 'auth/login/') {
        // Clear any existing token for login
        // document.cookie = 'csrftoken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    // }

    // if (true) {
    //     const res = await fetch(
    //         `${BASE_URL}/auth/csrf/`, 
    //         {
    //             credentials: 'include'  // This is crucial!
    //         }
    //     );
        
    //     if (!res.ok) {
    //         throw new Error(`CSRF Token Fetch Error: ${res.status}`);
    //     }
    
    //     await res.json();
    // }
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
    } catch (error) {
        const err = new Error('Service Unavailable');
        err.status = 503;
        err.statusText = 'Failed to connect to the server. Please try again later.';
        throw err;
    }
    if (!response.ok) {
        let errorMessage = response.statusText || 'Request failed';
        
        try {
            const errorBody = await response.text();
            if (errorBody) {
                try {
                    const errorJson = JSON.parse(errorBody);
                    errorMessage = errorJson.message || errorJson.detail || errorMessage;
                } catch {
                    errorMessage = errorBody;
                }       
            }
        } catch {}

        const error = new Error(errorMessage);
        error.status = response.status;
        error.statusText = response.statusText;
        
        throw error;
    }

    return await response.json();
}