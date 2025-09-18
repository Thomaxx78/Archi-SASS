"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

export default function LoginPage() {
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const router = useRouter();
	const searchParams = useSearchParams();
	const callbackUrl = searchParams.get("callbackUrl") || "/";

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setIsLoading(true);

		try {
			const result = await signIn("credentials", {
				email: formData.email,
				password: formData.password,
				redirect: false,
			});

			console.log("SignIn result:", result);

			if (result?.error) {
				console.log("SignIn error:", result.error);
				if (result.error === "UNVERIFIED_EMAIL") {
					setError("Veuillez vérifier votre email avant de vous connecter");
				} else {
					setError("Email ou mot de passe incorrect");
				}
			} else if (result?.ok) {
				console.log("SignIn successful, redirecting...");
				router.push(callbackUrl);
			}
		} catch (error) {
			console.error("SignIn exception:", error);
			setError("Une erreur est survenue lors de la connexion");
		} finally {
			setIsLoading(false);
		}
	};

	const handleGoogleSignIn = async () => {
		try {
			await signIn("google");
		} catch (error) {
			console.error("Google SignIn error:", error);
			setError("Une erreur est survenue lors de la connexion avec Google");
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

			<Card className="w-full max-w-md border-0 shadow-xl shadow-blue-500/10">
				<CardHeader className="pb-4 text-center">
					<CardTitle className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-3xl font-bold text-transparent">
						Se connecter
					</CardTitle>
				</CardHeader>

				<CardContent className="space-y-6">
					{error && (
						<div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
							<svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
							<p className="text-sm text-red-600">{error}</p>
						</div>
					)}

					<form onSubmit={handleSubmit} className="space-y-5">
						<div className="space-y-2">
							<Label htmlFor="email" className="font-medium text-slate-700">
								Email *
							</Label>
							<Input
								id="email"
								type="email"
								required
								value={formData.email}
								onChange={(e) => setFormData({ ...formData, email: e.target.value })}
								placeholder="votre.email@exemple.com"
								className="focus:border-blue-500 focus:ring-blue-500"
							/>
						</div>

						<div className="space-y-2">
							<div className="flex items-center justify-between">
								<Label htmlFor="password" className="font-medium text-slate-700">
									Mot de passe *
								</Label>
								<Link
									href="/forgot-password"
									className="text-sm font-medium text-blue-600 transition-colors hover:text-blue-700"
								>
									Mot de passe oublié ?
								</Link>
							</div>
							<Input
								id="password"
								type="password"
								required
								minLength={6}
								value={formData.password}
								onChange={(e) => setFormData({ ...formData, password: e.target.value })}
								placeholder="••••••••"
								className="focus:border-blue-500 focus:ring-blue-500"
							/>
							<p className="text-xs text-slate-500">Au moins 6 caractères</p>
						</div>

						<Button
							type="submit"
							disabled={isLoading || !formData.email || !formData.password}
							className="h-12 w-full bg-gradient-to-r from-blue-600 to-purple-600 text-lg hover:from-blue-700 hover:to-purple-700"
						>
							{isLoading ? (
								<>
									<svg className="mr-2 h-4 w-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
										/>
									</svg>
									Connexion en cours...
								</>
							) : (
								<>
									<svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
										/>
									</svg>
									Se connecter
								</>
							)}
						</Button>
					</form>

					<div className="flex items-center gap-4 py-4">
						<div className="flex-1 border-t border-slate-200"></div>
						<span className="text-sm text-slate-500">OU</span>
						<div className="flex-1 border-t border-slate-200"></div>
					</div>

					<Button
						type="button"
						variant="outline"
						onClick={handleGoogleSignIn}
						className="w-full h-12 text-slate-700 border-slate-300 hover:bg-slate-50"
					>
						<svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
							<path
								fill="#4285F4"
								d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
							/>
							<path
								fill="#34A853"
								d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
							/>
							<path
								fill="#FBBC05"
								d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
							/>
							<path
								fill="#EA4335"
								d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
							/>
						</svg>
						Continuer avec Google
					</Button>

					<div className="pt-4 text-center">
						<p className="text-slate-600">
							Pas encore de compte ?{" "}
							<Link href="/register" className="font-medium text-blue-600 transition-colors hover:text-blue-700">
								Créer un compte
							</Link>
						</p>
					</div>
				</CardContent>
			</Card>
		</main>
	);
}
