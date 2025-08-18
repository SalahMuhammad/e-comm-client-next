"use server"

import { cookies } from 'next/headers'


export async function setServerCookie(name, value, options = {}) {
    const cookieStore = await cookies()
    
    cookieStore.set(name, value, {
        path: options.path || '/',
        secure: options.secure || process.env.NODE_ENV === 'production',
        sameSite: options.sameSite || 'lax',
        maxAge: options.maxAge || 60 * 60 * 24 * 1, // 1 week default
        ...options
    })
}

export async function getServerCookie(name) {
    const cookieStore = await cookies()
    return cookieStore.get(name)?.value
}

export async function getServerAuthToken() {
    const cookieStore = await cookies()
    const auth0 = cookieStore.get('auth_0')?.value || ''
    const auth1 = cookieStore.get('auth_1')?.value || ''
    return auth0 && auth1 ? `${auth0}${auth1}` : ''
}

export async function deleteServerCookie(name) {
    const cookieStore = await cookies()
    cookieStore.delete(name)
}
