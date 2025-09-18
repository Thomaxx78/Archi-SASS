"use client";

import { type Session } from "next-auth";
import { api } from "~/trpc/react";
import { useState, useEffect } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import { Header } from "~/components/ui/header";
import { BackButton } from "~/components/ui/back-button";
import Link from "next/link";

interface ProfileProps {
	session: Session;
}

export default function Profile({ session }: ProfileProps) {
	const [isEditing, setIsEditing] = useState(false);
	const [mounted, setMounted] = useState(false);
	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		description: "",
	});

	const { data: profile, isLoading, error, refetch } = api.user.getProfile.useQuery();
	const updateProfile = api.user.updateProfile.useMutation({
		onSuccess: async () => {
			setIsEditing(false);
			await refetch();
		},
	});

	// Initialize form data when profile loads
	useEffect(() => {
		if (profile) {
			setFormData({
				firstName: (profile as any).firstName ?? "",
				lastName: (profile as any).lastName ?? "",
				description: (profile as any).description ?? "",
			});
		}
	}, [profile]);

	// Handle hydration
	useEffect(() => {
		setMounted(true);
	}, []);

	if (isLoading) {
		return (
			<main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50">
				<Card className="w-full max-w-md text-center">
					<CardContent className="pt-6">
						<div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
						<p className="text-slate-600">Chargement de votre profil...</p>
					</CardContent>
				</Card>
			</main>
		);
	}

	if (error) {
		return (
			<main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50">
				<Card className="w-full max-w-md border-red-200 text-center">
					<CardContent className="pt-6">
						<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
							<span className="text-2xl">⚠️</span>
						</div>
						<CardTitle className="mb-2 text-slate-800">Erreur de chargement</CardTitle>
						<p className="mb-4 text-slate-600">Impossible de charger votre profil. Veuillez réessayer.</p>
						<Button variant="outline" onClick={() => window.location.reload()}>
							Réessayer
						</Button>
					</CardContent>
				</Card>
			</main>
		);
	}

	return (
		<main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50">
			<Header session={session} profile={profile} mounted={mounted} />
			<BackButton href="/" label="Retour au dashboard" />

			{/* Profile Content */}
			<div className="container mx-auto px-6 py-8">
				<div className="mx-auto max-w-4xl">
					{/* Profile Header */}
					<div className="mb-8">
						<Card className="rounded-xl border-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
							<CardContent className="p-8">
								<div className="flex items-center gap-6">
									<Avatar className="h-20 w-20">
										<AvatarFallback className="bg-white/20 text-2xl text-white backdrop-blur-sm">
											{mounted
												? ((profile as any)?.firstName?.charAt(0) ??
													session.user?.name?.charAt(0) ??
													session.user?.email?.charAt(0) ??
													"U")
												: "U"}
										</AvatarFallback>
									</Avatar>
									<div className="flex-1">
										<h1 className="mb-2 text-3xl font-bold">
											{mounted
												? (profile as any)?.firstName && (profile as any)?.lastName
													? `${(profile as any).firstName} ${(profile as any).lastName}`
													: (session.user?.name ?? "Utilisateur")
												: "Utilisateur"}
										</h1>
										<p className="mb-4 text-lg text-blue-100">
											{mounted
												? (profile as any)?.description || "Aucune description pour le moment"
												: "Aucune description pour le moment"}
										</p>
										<Badge variant="secondary" className="border-white/30 bg-white/20 text-white hover:bg-white/30">
											<svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
												/>
											</svg>
											{mounted ? profile?.email : ""}
										</Badge>
									</div>
									{!isEditing && (
										<Button
											size="lg"
											variant="secondary"
											className="border-white/30 bg-white/20 text-white hover:bg-white/30"
											onClick={() => setIsEditing(true)}
										>
											<svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
												/>
											</svg>
											Modifier le profil
										</Button>
									)}
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Profile Details Card */}
					<Card className="rounded-xl border-0 shadow-md">
						<CardHeader className="border-b border-slate-100">
							<CardTitle className="flex items-center gap-2 text-2xl text-slate-900">
								<svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
									/>
								</svg>
								Informations personnelles
							</CardTitle>
						</CardHeader>

						<CardContent className="p-6">
							{isEditing ? (
								<form
									onSubmit={(e) => {
										e.preventDefault();
										updateProfile.mutate({
											firstName: formData.firstName || undefined,
											lastName: formData.lastName || undefined,
											description: formData.description || undefined,
										});
									}}
									className="space-y-6"
								>
									<div className="grid gap-6 md:grid-cols-2">
										<div className="space-y-2">
											<Label htmlFor="firstName" className="font-medium text-slate-700">
												Prénom
											</Label>
											<Input
												id="firstName"
												type="text"
												value={formData.firstName}
												onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
												placeholder="Votre prénom"
												className="focus:border-blue-500 focus:ring-blue-500"
											/>
										</div>
										<div className="space-y-2">
											<Label htmlFor="lastName" className="font-medium text-slate-700">
												Nom de famille
											</Label>
											<Input
												id="lastName"
												type="text"
												value={formData.lastName}
												onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
												placeholder="Votre nom de famille"
												className="focus:border-blue-500 focus:ring-blue-500"
											/>
										</div>
									</div>

									<div className="space-y-2">
										<Label htmlFor="email" className="font-medium text-slate-700">
											Email
										</Label>
										<Input
											id="email"
											type="email"
											value={profile?.email ?? ""}
											disabled
											className="cursor-not-allowed bg-slate-50 text-slate-500"
										/>
										<p className="flex items-center gap-1 text-xs text-slate-500">
											<svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
												/>
											</svg>
											L'email ne peut pas être modifié
										</p>
									</div>

									<div className="space-y-2">
										<Label htmlFor="description" className="font-medium text-slate-700">
											Description
										</Label>
										<Textarea
											id="description"
											value={formData.description}
											onChange={(e) => setFormData({ ...formData, description: e.target.value })}
											rows={4}
											placeholder="Parlez-nous un peu de vous..."
											className="focus:border-blue-500 focus:ring-blue-500"
										/>
									</div>

									<Separator />

									<div className="flex gap-3 pt-2">
										<Button
											type="button"
											variant="outline"
											className="flex-1"
											onClick={() => {
												setIsEditing(false);
												setFormData({
													firstName: (profile as any)?.firstName ?? "",
													lastName: (profile as any)?.lastName ?? "",
													description: (profile as any)?.description ?? "",
												});
											}}
										>
											<svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
											</svg>
											Annuler
										</Button>
										<Button
											type="submit"
											disabled={updateProfile.isPending}
											className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
										>
											{updateProfile.isPending ? (
												<>
													<svg className="mr-2 h-4 w-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth={2}
															d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
														/>
													</svg>
													Enregistrement...
												</>
											) : (
												<>
													<svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
													</svg>
													Enregistrer
												</>
											)}
										</Button>
									</div>
								</form>
							) : (
								<div className="space-y-6">
									<div className="grid gap-6 md:grid-cols-2">
										<div className="space-y-2">
											<Label className="font-medium text-slate-700">Prénom</Label>
											<div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
												<p className="text-slate-800">
													{(profile as any)?.firstName || <span className="text-slate-400 italic">Non renseigné</span>}
												</p>
											</div>
										</div>
										<div className="space-y-2">
											<Label className="font-medium text-slate-700">Nom de famille</Label>
											<div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
												<p className="text-slate-800">
													{(profile as any)?.lastName || <span className="text-slate-400 italic">Non renseigné</span>}
												</p>
											</div>
										</div>
									</div>

									<div className="space-y-2">
										<Label className="font-medium text-slate-700">Email</Label>
										<div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3">
											<svg className="h-4 w-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
												/>
											</svg>
											<p className="text-slate-800">{profile?.email}</p>
										</div>
									</div>

									<div className="space-y-2">
										<Label className="font-medium text-slate-700">Description</Label>
										<div className="min-h-[80px] rounded-lg border border-slate-200 bg-slate-50 p-3">
											<p className="leading-relaxed text-slate-800">
												{(profile as any)?.description || <span className="text-slate-400 italic">Aucune description</span>}
											</p>
										</div>
									</div>
								</div>
							)}

							{updateProfile.error && (
								<div className="mt-6 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
									<svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
										/>
									</svg>
									<div>
										<p className="text-sm font-medium text-red-800">Erreur lors de la mise à jour</p>
										<p className="text-sm text-red-600">Impossible de sauvegarder vos modifications. Veuillez réessayer.</p>
									</div>
								</div>
							)}
						</CardContent>
					</Card>

					<Link href="/profile/sub" className="text-sm font-medium text-blue-600 hover:underline">
						Modifier mon profil
					</Link>
				</div>
			</div>
		</main>
	);
}
