"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

export default function VerifyEmailPage() {
	const router = useRouter();
	const searchParams = useSearchParams();

	const token = searchParams.get("token");

	const [status, setStatus] = useState<"verifying" | "success" | "error" | "invalid">("verifying");

	const verifyEmail = api.auth.verifyEmail.useMutation({
		onSuccess: () => {
			setStatus("success");
			setTimeout(() => {
				router.push("/login?verified=true");
			}, 3000);
		},
		onError: () => {
			setStatus("error");
		},
	});

	useEffect(() => {
		if (!token) {
			setStatus("invalid");
			return;
		}
		verifyEmail.mutate({ token });
	}, [token]);

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

			<Card className="w-full max-w-md border-0 shadow-xl shadow-blue-500/10">
				<CardContent className="pt-8">
					{status === "verifying" && (
						<div className="text-center">
							<div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
								<svg className="h-8 w-8 animate-spin text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
									/>
								</svg>
							</div>
							<CardTitle className="mb-2 text-2xl font-bold text-slate-900">Vérification en cours...</CardTitle>
							<p className="text-slate-600">Nous vérifions votre adresse email</p>
						</div>
					)}

					{status === "success" && (
						<div className="text-center">
							<div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
								<svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
								</svg>
							</div>
							<CardTitle className="mb-2 text-2xl font-bold text-green-600">Email vérifié !</CardTitle>
							<p className="mb-6 text-slate-600">
								Votre compte a été activé avec succès. Vous allez être redirigé vers la page de connexion...
							</p>
							<Button
								onClick={() => router.push("/auth/signin")}
								className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
							>
								Se connecter maintenant
							</Button>
						</div>
					)}

					{status === "error" && (
						<div className="text-center">
							<div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
								<svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
							</div>
							<CardTitle className="mb-2 text-2xl font-bold text-red-600">Échec de la vérification</CardTitle>
							<p className="mb-6 text-slate-600">Le lien de vérification est invalide ou expiré.</p>
							<div className="space-y-3">
								<Button variant="outline" onClick={() => router.push("/auth/register")} className="w-full">
									Créer un nouveau compte
								</Button>
								<Button variant="ghost" onClick={() => router.push("/auth/signin")} className="w-full">
									Retour à la connexion
								</Button>
							</div>
						</div>
					)}

					{status === "invalid" && (
						<div className="text-center">
							<div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
								<svg className="h-8 w-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
									/>
								</svg>
							</div>
							<CardTitle className="mb-2 text-2xl font-bold text-orange-600">Lien invalide</CardTitle>
							<p className="mb-6 text-slate-600">Aucun token de vérification trouvé dans l'URL.</p>
							<Button
								onClick={() => router.push("/auth/register")}
								className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
							>
								Créer un compte
							</Button>
						</div>
					)}
				</CardContent>
			</Card>
		</main>
	);
}
