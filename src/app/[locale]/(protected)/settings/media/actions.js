import { apiRequest } from "@/utils/api";


export default async function getMediaFiles() {
    return await apiRequest('api/services/media-browser/')
}
