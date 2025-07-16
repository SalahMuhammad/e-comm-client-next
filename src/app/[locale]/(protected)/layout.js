import Sidebar from "@/components/Sidebar";
import { getServerCookie } from "@/utils/serverCookieHandelr";
import { redirect } from "next/navigation";
import { Toaster } from 'sonner'

export default async function ProtectedLayout({ children }) {
  if (await getServerCookie("username") == undefined || await getServerCookie("auth_0") == undefined || await getServerCookie("auth_1") == undefined) {
    redirect("/auth")
  }
  const username = await getServerCookie('username')

  const themeCookie = await getServerCookie('theme') || 'light'
  let theme = "light"
  if (themeCookie == "auto") {
    theme = "system"
  } else if(themeCookie == "dark") {
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
      <div className="p-4 sm:ml-64 mt-14" >
        { children }
      </div>
    </>
  );
}
