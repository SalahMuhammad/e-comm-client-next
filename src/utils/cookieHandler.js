"use client";

export function getAuthCookie(name) {
    // if (isCookieExist(name)) {
        try {
            const cookies = document.cookie.split(';');
            const countCookie = cookies.find(c => c.trim().startsWith(`${name}_count=`));
            
            if (! countCookie) return null;
            
            const count = parseInt(countCookie.split('=')[1]);
            let value = '';
            
            for (let i = 0; i < count; i++) {
                const chunkCookie = cookies.find(c => c.trim().startsWith(`${name}_${i}=`));
                if (chunkCookie) {
                const chunk = chunkCookie.substring(chunkCookie.indexOf('=') + 1);
                value += decodeURIComponent(chunk);
                }
            }

            return value
        }
        catch (error) {
            console.log('getCookie() Error')
            console.error(error)
        }
    // }
}



export function getCookie(name) {
    try {
        if (typeof window === 'undefined') {
            return null;
        }

        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);

        if (parts.length === 2) {
            return decodeURIComponent(parts.pop().split(';').shift());
        }
        
        return null;
    } catch (error) {
        console.error('getCookie() Error:', error);
        return null;
    }
}

export function getClientAuthToken() {
    const auth0 = getCookie('auth_0') || '';
    const auth1 = getCookie('auth_1') || '';
    return auth0 && auth1 ? `${auth0}${auth1}` : '';
}

// Helper function to check if cookie exists
export function hasCookie(name) {
    return getCookie(name) !== null;
}

// Helper function to parse cookies
export function getAllCookies() {
    try {
        return document.cookie
            .split(';')
            .reduce((cookies, cookie) => {
                const [name, value] = cookie.split('=').map(c => c.trim());
                cookies[name] = decodeURIComponent(value);
                return cookies;
            }, {});
    } catch (error) {
        console.error('getAllCookies() Error:', error);
        return {};
    }
}


/**
 * Sets a cookie in the browser with the specified name, value, and options.
 *
 * @param {string} name - The name of the cookie.
 * @param {string} value - The value to be stored in the cookie.
 * @param {Object} [options={}] - Optional settings for the cookie.
 * @param {number|Date} [options.expires] - Expiration time in seconds (number) or a specific Date object.
 * @param {string} [options.path='/'] - The path where the cookie is accessible.
 * @param {string} [options.domain] - The domain where the cookie is accessible.
 * @param {boolean} [options.secure] - Whether the cookie should only be transmitted over secure protocols.
 * @param {string} [options.sameSite] - The SameSite attribute ('Strict', 'Lax', or 'None').
 * @returns {void}
 */
export function setCookie(name, value, options = {}) {
    try {
        let cookieStr = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

        if (options.expires) {
            if (typeof options.expires === 'number') {
                const date = new Date();
                date.setTime(date.getTime() + options.expires * 1000);
                cookieStr += `; expires=${date.toUTCString()}`;
            } else if (options.expires instanceof Date) {
                cookieStr += `; expires=${options.expires.toUTCString()}`;
            }
        }

        if (options.path) {
            cookieStr += `; path=${options.path}`;
        } else {
            cookieStr += `; path=/`;
        }
        
        if (options.domain) {
            cookieStr += `; domain=${options.domain}`;
        }

        if (options.secure) {
            cookieStr += `; secure`;
        }

        if (options.sameSite) {
            cookieStr += `; samesite=${options.sameSite}`;
        }
        document.cookie = cookieStr;
    } catch (error) {
        console.error('setCookie() Error:', error);
    }
}

