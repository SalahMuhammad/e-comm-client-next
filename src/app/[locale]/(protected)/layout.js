import RoleProvider from "@/app/providers/role-provider";
import Sidebar from "@/components/Sidebar";
import { getServerCookie, getServerAuthToken } from "@/utils/serverCookieHandelr";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
export default async function ProtectedLayout({ children }) {
    if (await getServerCookie("username") == undefined || await getServerCookie("auth_0") == undefined || await getServerCookie("auth_1") == undefined) {
        // redirect("/auth")
        redirect(`/auth/logout?nexturl=${(await headers()).get('x-original-url') || ''}`, 'replace')
    }
    const username = await getServerCookie('username')
    const token = await getServerAuthToken()

    return (
        <>
            <RoleProvider>
                <Sidebar username={username} token={token} />
                <div className="p-4 sm:ml-64 mt-14 min-h-screen flex flex-col" >
                    {children}
                </div>
            </RoleProvider>
        </>
    );
}
