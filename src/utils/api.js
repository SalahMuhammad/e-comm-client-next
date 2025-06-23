import { getServerAuthToken } from "./serverCookieHandelr";

const BASE_URL = process.env.API_URL || 'http://localhost:8000';

export async function apiRequest(endpoint, options = {}) {
    const url = `${BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    console.log(await getServerAuthToken(), 5435345)
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
    const response = await fetch(url, {
        headers: {
            "auth": await getServerAuthToken(),
            ...headersss,
            
        },
        // 'credentials': 'include',  // Important for cookies
        // cache: 'no-store', // 'force-cache', // or 'no-store' for dynamic data
        // next: { revalidate: 3600 }, // revalidate every hour
        ...options,
    });

    if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
    }

    return response.json()
}
