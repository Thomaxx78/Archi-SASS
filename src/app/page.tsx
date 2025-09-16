import Link from "next/link";

import { auth } from "~/server/auth";

export default async function Home() {
    const session = await auth();

    if (!session) {
        return (
            <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
                <div className="flex flex-col items-center gap-4">
                    <p className="text-2xl">Not logged in</p>
                    <Link
                        href="/api/auth/signin"
                        className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
                    >
                        Sign in with Email
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
            <div className="flex flex-col items-center gap-4">
                <div className="rounded-xl bg-white/10 p-6">
                    <h2 className="mb-4 text-2xl font-bold">User Information</h2>
                    <div className="space-y-2">
                        <p className="text-lg">
                            <span className="font-semibold">Email:</span> {session.user?.email}
                        </p>
                        <p className="text-lg">
                            <span className="font-semibold">Name:</span> {session.user?.name ?? "Not set"}
                        </p>
                        <p className="text-lg">
                            <span className="font-semibold">User ID:</span> {session.user?.id}
                        </p>
                        {session.user?.image && (
                            <p className="text-lg">
                                <span className="font-semibold">Image:</span> {session.user.image}
                            </p>
                        )}
                    </div>
                </div>
                <Link
                    href="/api/auth/signout"
                    className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
                >
                    Sign out
                </Link>
            </div>
        </main>
    );
}
