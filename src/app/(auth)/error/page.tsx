"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

export default function AuthErrorPage() {
	const searchParams = useSearchParams();
	const error = searchParams.get("error");

	const getErrorMessage = (error: string | null) => {
		switch (error) {
			case "Configuration":
				return "Il y a un problème avec la configuration du serveur.";
			case "AccessDenied":
				return "Accès refusé. Vous n'avez pas l'autorisation d'accéder à cette ressource.";
			case "Verification":
				return "Le token a expiré ou a déjà été utilisé.";
			case "Default":
			default:
				return "Une erreur d'authentification s'est produite.";
		}
	};

	return (
		<main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50 p-4">
			{/* Logo */}
			<div className="absolute top-6 left-6">
				<Link href="/" className="flex items-center space-x-2">
					<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600">
						<span className="text-sm font-bold text-white">E</span>
					</div>
					<span className="text-xl font-bold text-slate-900">EventMaster</span>
				</Link>
			</div>

			<Card className="w-full max-w-md border-0 shadow-xl shadow-red-500/10">
				<CardHeader className="text-center">
					<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
						<svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
					</div>
					<CardTitle className="text-2xl font-bold text-red-600">Erreur d'authentification</CardTitle>
				</CardHeader>

				<CardContent className="space-y-6 text-center">
					<p className="text-slate-600">{getErrorMessage(error)}</p>

					<div className="space-y-3">
						<Button asChild className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
							<Link href="/login">Retour à la connexion</Link>
						</Button>

						<Button variant="outline" asChild className="w-full">
							<Link href="/">Retour à l'accueil</Link>
						</Button>
					</div>
				</CardContent>
			</Card>
		</main>
	);
}
