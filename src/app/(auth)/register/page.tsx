"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Badge } from "~/components/ui/badge";

export default function RegisterPage() {
	const [formData, setFormData] = useState({
		email: "",
		password: "",
		name: "",
	});
	const [error, setError] = useState("");

	const router = useRouter();
	const register = api.auth.register.useMutation({
		onSuccess: () => router.push("/check-email"),
		onError: (err) => setError(err.message),
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		register.mutate(formData);
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
				<CardHeader className="pb-8 text-center">
					<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500">
						<svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
							/>
						</svg>
					</div>
					<CardTitle className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-3xl font-bold text-transparent">
						Créer un compte
					</CardTitle>
					<p className="mt-2 text-slate-600">Rejoignez EventMaster et organisez vos premiers événements</p>
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
							<Label htmlFor="name" className="font-medium text-slate-700">
								Nom (optionnel)
							</Label>
							<Input
								id="name"
								type="text"
								value={formData.name}
								onChange={(e) => setFormData({ ...formData, name: e.target.value })}
								placeholder="Votre nom"
								className="focus:border-blue-500 focus:ring-blue-500"
							/>
						</div>

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
							disabled={register.isPending || !formData.email || !formData.password}
							className="h-12 w-full bg-gradient-to-r from-blue-600 to-purple-600 text-lg hover:from-blue-700 hover:to-purple-700"
						>
							{register.isPending ? (
								<>
									<svg className="mr-2 h-4 w-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
										/>
									</svg>
									Création en cours...
								</>
							) : (
								<>
									<svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
										/>
									</svg>
									Créer mon compte
								</>
							)}
						</Button>
					</form>

					<div className="pt-4 text-center">
						<p className="text-slate-600">
							Déjà un compte ?{" "}
							<Link href="/login" className="font-medium text-blue-600 transition-colors hover:text-blue-700">
								Se connecter
							</Link>
						</p>
					</div>

					<div className="flex items-center justify-center gap-4 pt-4 text-xs text-slate-500">
						<Badge variant="secondary" className="border-green-200 bg-green-50 text-green-700">
							<svg className="mr-1 h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
								<path
									fillRule="evenodd"
									d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
									clipRule="evenodd"
								/>
							</svg>
							Gratuit pour commencer
						</Badge>
						<Badge variant="secondary" className="border-blue-200 bg-blue-50 text-blue-700">
							<svg className="mr-1 h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
								/>
							</svg>
							100% sécurisé
						</Badge>
					</div>
				</CardContent>
			</Card>
		</main>
	);
}
