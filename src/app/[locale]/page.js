import { redirect } from "next/navigation"

export default function Page() {
    redirect('/auth')
    return (
        <h1>home</h1>
    )
}