import Link from "next/link";

import { auth } from "~/server/auth";
import Dashboard from "~/components/05-pages/Dashboard";
import Landing from "~/components/05-pages/Landing";

export default async function Home() {
    const session = await auth();

    if (session) {
        return <Dashboard session={session} />;
    }

    return (
        <Landing />
    );
}
