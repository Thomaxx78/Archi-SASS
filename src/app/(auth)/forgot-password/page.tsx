"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

export default function ForgotPasswordPage() {
	const [email, setEmail] = useState("");
	const [isSubmitted, setIsSubmitted] = useState(false);

	const router = useRouter();

	const forgotPassword = api.auth.forgotPassword.useMutation({
		onSuccess: () => {
			setIsSubmitted(true);
		},
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		forgotPassword.mutate({ email });
	};

	if (isSubmitted) {
		return (
			<main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50 p-4">
				<div className="absolute top-6 left-6">
					<Link href="/" className="flex items-center space-x-2">
						<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600">
							<span className="text-sm font-bold text-white">E</span>
						</div>
						<span className="text-xl font-bold text-slate-900">EventMaster</span>
					</Link>
				</div>

				<Card className="w-full max-w-md border-0 shadow-xl shadow-blue-500/10">
					<CardHeader className="pb-4 text-center">
						<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
							<svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
							</svg>
						</div>
						<CardTitle className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-2xl font-bold text-transparent">
							Email envoyé !
						</CardTitle>
					</CardHeader>

					<CardContent className="space-y-6 text-center">
						<div className="space-y-3">
							<p className="text-slate-700">
								Si une adresse email <strong>{email}</strong> existe dans notre système, vous recevrez un lien de réinitialisation dans quelques minutes.
							</p>
							<div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
								<p className="text-sm text-blue-800">
									<strong>💡 Conseil :</strong> Vérifiez également votre dossier de spam/courrier indésirable.
								</p>
							</div>
						</div>

						<div className="space-y-3 pt-4">
							<Button
								onClick={() => setIsSubmitted(false)}
								variant="outline"
								className="w-full"
							>
								Renvoyer l'email
							</Button>
							<Button asChild variant="ghost" className="w-full">
								<Link href="/login">
									Retour à la connexion
								</Link>
							</Button>
						</div>
					</CardContent>
				</Card>
			</main>
		);
	}

	return (
		<main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50 p-4">
			<div className="absolute top-6 left-6">
				<Link href="/" className="flex items-center space-x-2">
					<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600">
						<span className="text-sm font-bold text-white">E</span>
					</div>
					<span className="text-xl font-bold text-slate-900">EventMaster</span>
				</Link>
			</div>

			<Card className="w-full max-w-md border-0 shadow-xl shadow-blue-500/10">
				<CardHeader className="pb-4 text-center">
					<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
						<svg className="h-8 w-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v-2l-4.707-4.707a1 1 0 010-1.414L8.586 5.086a1 1 0 011.414 0L11 6l5 5a2 2 0 012-2z" />
						</svg>
					</div>
					<CardTitle className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-3xl font-bold text-transparent">
						Mot de passe oublié
					</CardTitle>
				</CardHeader>

				<CardContent className="space-y-6">
					<div className="text-center">
						<p className="text-slate-600">
							Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
						</p>
					</div>

					{forgotPassword.error && (
						<div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
							<svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
							<p className="text-sm text-red-600">{forgotPassword.error.message}</p>
						</div>
					)}

					<form onSubmit={handleSubmit} className="space-y-5">
						<div className="space-y-2">
							<Label htmlFor="email" className="font-medium text-slate-700">
								Adresse email *
							</Label>
							<Input
								id="email"
								type="email"
								required
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder="votre.email@exemple.com"
								className="focus:border-blue-500 focus:ring-blue-500"
								disabled={forgotPassword.isPending}
							/>
						</div>

						<Button
							type="submit"
							disabled={forgotPassword.isPending || !email}
							className="h-12 w-full bg-gradient-to-r from-blue-600 to-purple-600 text-lg hover:from-blue-700 hover:to-purple-700"
						>
							{forgotPassword.isPending ? (
								<>
									<svg className="mr-2 h-4 w-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
									</svg>
									Envoi en cours...
								</>
							) : (
								<>
									<svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
									</svg>
									Envoyer le lien de réinitialisation
								</>
							)}
						</Button>
					</form>

					<div className="pt-4 text-center">
						<p className="text-slate-600">
							Vous vous souvenez de votre mot de passe ?{" "}
							<Link href="/login" className="font-medium text-blue-600 transition-colors hover:text-blue-700">
								Se connecter
							</Link>
						</p>
					</div>
				</CardContent>
			</Card>
		</main>
	);
}