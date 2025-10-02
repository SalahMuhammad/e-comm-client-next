import EventNotFound from "@/components/NotFound";
import { HomeIcon } from "@heroicons/react/24/outline";

export default function error403() {
    return <EventNotFound title={"Acces Denied"} message={"You don’t have permission to access this page."} customButton={{icon: <HomeIcon className="w-4 h-4" />, label: "Home", href: "/"}} />
}