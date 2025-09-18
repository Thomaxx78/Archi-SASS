"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

export default function ResetPasswordPage() {
	const [formData, setFormData] = useState({
		newPassword: "",
		confirmPassword: "",
	});
	const [isSuccess, setIsSuccess] = useState(false);

	const router = useRouter();
	const searchParams = useSearchParams();
	const token = searchParams.get("token");

	const resetPassword = api.auth.resetPassword.useMutation({
		onSuccess: () => {
			setIsSuccess(true);
		},
	});

	useEffect(() => {
		if (!token) {
			router.push("/login");
		}
	}, [token, router]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (formData.newPassword !== formData.confirmPassword) {
			return;
		}

		if (!token) return;

		resetPassword.mutate({
			token,
			newPassword: formData.newPassword,
		});
	};

	const passwordsMatch = formData.newPassword === formData.confirmPassword;
	const isFormValid = formData.newPassword.length >= 6 && passwordsMatch;

	if (!token) {
		return (
			<main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50 p-4">
				<Card className="w-full max-w-md text-center border-red-200">
					<CardContent className="pt-6">
						<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
							<span className="text-2xl">⚠️</span>
						</div>
						<CardTitle className="mb-2 text-slate-800">Lien invalide</CardTitle>
						<p className="text-slate-600 mb-4">Ce lien de réinitialisation est invalide ou a expiré.</p>
						<Button asChild variant="outline">
							<Link href="/forgot-password">
								Demander un nouveau lien
							</Link>
						</Button>
					</CardContent>
				</Card>
			</main>
		);
	}

	if (isSuccess) {
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
							Mot de passe mis à jour !
						</CardTitle>
					</CardHeader>

					<CardContent className="space-y-6 text-center">
						<div className="space-y-3">
							<p className="text-slate-700">
								Votre mot de passe a été mis à jour avec succès. Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.
							</p>
						</div>

						<div className="pt-4">
							<Button asChild className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
								<Link href="/login">
									<svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
									</svg>
									Se connecter
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
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
						</svg>
					</div>
					<CardTitle className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-3xl font-bold text-transparent">
						Nouveau mot de passe
					</CardTitle>
				</CardHeader>

				<CardContent className="space-y-6">
					<div className="text-center">
						<p className="text-slate-600">
							Créez un nouveau mot de passe sécurisé pour votre compte.
						</p>
					</div>

					{resetPassword.error && (
						<div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
							<svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
							<p className="text-sm text-red-600">{resetPassword.error.message}</p>
						</div>
					)}

					<form onSubmit={handleSubmit} className="space-y-5">
						<div className="space-y-2">
							<Label htmlFor="newPassword" className="font-medium text-slate-700">
								Nouveau mot de passe *
							</Label>
							<Input
								id="newPassword"
								type="password"
								required
								minLength={6}
								value={formData.newPassword}
								onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
								placeholder="••••••••"
								className="focus:border-blue-500 focus:ring-blue-500"
								disabled={resetPassword.isPending}
							/>
							<p className="text-xs text-slate-500">Au moins 6 caractères</p>
						</div>

						<div className="space-y-2">
							<Label htmlFor="confirmPassword" className="font-medium text-slate-700">
								Confirmer le mot de passe *
							</Label>
							<Input
								id="confirmPassword"
								type="password"
								required
								minLength={6}
								value={formData.confirmPassword}
								onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
								placeholder="••••••••"
								className={`focus:ring-blue-500 ${
									formData.confirmPassword && !passwordsMatch
										? 'border-red-300 focus:border-red-500'
										: 'focus:border-blue-500'
								}`}
								disabled={resetPassword.isPending}
							/>
							{formData.confirmPassword && !passwordsMatch && (
								<p className="text-xs text-red-600">Les mots de passe ne correspondent pas</p>
							)}
						</div>

						<Button
							type="submit"
							disabled={resetPassword.isPending || !isFormValid}
							className="h-12 w-full bg-gradient-to-r from-blue-600 to-purple-600 text-lg hover:from-blue-700 hover:to-purple-700"
						>
							{resetPassword.isPending ? (
								<>
									<svg className="mr-2 h-4 w-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
									</svg>
									Mise à jour en cours...
								</>
							) : (
								<>
									<svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
									</svg>
									Mettre à jour le mot de passe
								</>
							)}
						</Button>
					</form>

					<div className="pt-4 text-center">
						<p className="text-slate-600">
							<Link href="/login" className="font-medium text-blue-600 transition-colors hover:text-blue-700">
								Retour à la connexion
							</Link>
						</p>
					</div>
				</CardContent>
			</Card>
		</main>
	);
}