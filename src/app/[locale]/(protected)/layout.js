import RoleProvider from "@/app/providers/role-provider";
import Sidebar from "@/components/Sidebar";
import { getServerCookie } from "@/utils/serverCookieHandelr";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Toaster } from 'sonner'

export default async function ProtectedLayout({ children }) {
    if (await getServerCookie("username") == undefined || await getServerCookie("auth_0") == undefined || await getServerCookie("auth_1") == undefined) {
        // redirect("/auth")
        redirect(`/auth/logout?nexturl=${(await headers()).get('x-original-url') || ''}`, 'replace')
    }
    const username = await getServerCookie('username')

    const themeCookie = await getServerCookie('theme') || 'light'
    let theme = "light"
    if (themeCookie == "auto") {
        theme = "system"
    } else if (themeCookie == "dark") {
        theme = "dark"
    }

    return (
        <>
            <Toaster
                position="bottom-right"
                theme={theme}
                richColors={true}
                closeButton={true}
            />

            <Sidebar username={username} />
            <RoleProvider>
                <div className="p-4 sm:ml-64 mt-14 min-h-screen flex flex-col" >
                    {children}
                </div>
            </RoleProvider>
        </>
    );
}
