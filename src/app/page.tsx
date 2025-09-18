"use client";

import { useSession } from "next-auth/react";
import Dashboard from "~/components/05-pages/Dashboard";
import Landing from "~/components/05-pages/Landing";

export default function Home() {
	const { data: session, status } = useSession();
	if (status === "loading") {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
			</div>
		);
	}

	if (status === "authenticated" && session) {
		return <Dashboard session={session} />;
	}

	// Sinon, afficher la page d'accueil
	return <Landing />;
}
