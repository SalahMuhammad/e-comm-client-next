import { apiRequest } from "@/utils/api";
import { getServerAuthToken } from "@/utils/serverCookieHandelr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req) {
    const co = await cookies()
        console.log('All cookies:', co.getAll())


    console.log(66666, await getServerAuthToken())

    const cookieHeader = req.headers
    console.log('Cookie header:', cookieHeader)

    // const tenantCookie = request?.cookies
    // console.log(tenantCookie._parsed, 2222222222222)
    const { searchParams } = new URL(req.url);
    const limit = searchParams.get('limit') ?? 12
    const offset = searchParams.get('offset') ?? 0
// console.log(await getServerAuthToken(), 1111111111111111)
    const res = await apiRequest(
        `/api/items/?limit=${limit}&offset=${offset}`, 
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            cashe: "no-store", // Disable caching for this request
        }
    )

    return NextResponse.json({
        data: 1
    })
}

export async function POST() {
    console.log(22222)

    return NextResponse.json({
        aa: '22 '
    })
}
