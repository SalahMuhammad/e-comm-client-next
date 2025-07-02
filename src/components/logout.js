import { deleteServerCookie } from "@/utils/serverCookieHandelr";
import { redirect } from "next/navigation";


export default async function logout() {
    await deleteServerCookie('auth_0')
    await deleteServerCookie('auth_1')
    await deleteServerCookie('username')

    // router.push('/api/logout')
    redirect('/auth/')
}