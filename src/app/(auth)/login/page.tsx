"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
				router.push("/");
			}
		} catch (error) {
			console.error("SignIn exception:", error);
			setError("Une erreur est survenue lors de la connexion");
		} finally {
			setIsLoading(false);
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
							<Label htmlFor="password" className="font-medium text-slate-700">
								Mot de passe *
							</Label>
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
