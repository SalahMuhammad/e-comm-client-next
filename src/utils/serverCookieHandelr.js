"use server"

import { cookies, headers  } from 'next/headers'


export async function setServerCookie(name, value, options = {}) {
    const cookieStore = await cookies()

    const headersList = await headers()
    const protocol = headersList.get('x-forwarded-proto') || 'http'
    const isSecure = protocol === 'https'

    cookieStore.set(name, value, {
        path: options.path || '/',
        secure: isSecure,
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
    const auth2 = cookieStore.get('auth_2')?.value || ''
    const auth3 = cookieStore.get('auth_3')?.value || ''
    return auth0 && auth1 ? `${auth0}${auth1}${auth2}${auth3}` : ''
}

export async function deleteServerCookie(name) {
    const cookieStore = await cookies()
    cookieStore.delete(name)
}
