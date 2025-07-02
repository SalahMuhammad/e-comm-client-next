'use server'

import { deleteServerCookie } from '@/utils/serverCookieHandelr'

export async function logoutAction() {
    await deleteServerCookie('auth_0')
    await deleteServerCookie('auth_1')
    await deleteServerCookie('username')
}