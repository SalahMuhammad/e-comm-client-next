import { getServerCookie } from "@/utils/serverCookieHandelr";
import { redirect } from "next/navigation";

export default async function AuthLayout({ children, params }) {
  if ((await getServerCookie('username') && await getServerCookie("auth_0") && await getServerCookie("auth_1") && ! `${params.pathname}`.includes('logout'))) {
    redirect(`/dashboard`);
  }

  return children

}
