import { getTranslations } from "next-intl/server";
import { getServerAuthToken } from "./serverCookieHandelr";

const BASE_URL = process.env.API_URL || 'http://localhost:8000';

export async function apiRequest(endpoint, options = {}) {
    const url = `${BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    const t = await getTranslations("global.errors")
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
        return {
            cMessage: '503' + " " + t('503'),
            status: 503
        }
    }

    switch (response.status) {
        case 404:
        case 403:
        case 500:
            return { 
                cMessage: response.status + " " + t(response.status.toString()), 
                status: response.status 
            } 
        default:
            return response
    }
}
