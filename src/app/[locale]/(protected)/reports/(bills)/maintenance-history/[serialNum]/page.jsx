// import { toast } from "sonner";
import PageView from "./view"
import { httpRequest } from "@/utils/HTTPMethods";
// import { useTranslations } from "next-intl";
// import { useRouter } from "next/navigation";

async function page({ params }) {
    // const router = useRouter()
    const serialNum = (await params).serialNum
    // const t = useTranslations('maintenance.report');
    const res = await httpRequest(`api/maintenance/?serial_number=${serialNum}`);
    // if (handleResponse(res)) return;
    // if (!res.ok) {
        // toast.error(t("error404"))
        // router.back()
    // }
    return (
        <PageView data={res} />
    )
}

export default page
