"use client";

import Link from "next/link";
import { type Session } from "next-auth";
import { api } from "~/trpc/react";
import { useState, useEffect } from "react";

interface ProfileProps {
	session: Session;
}

export default function Profile({ session }: ProfileProps) {
	const [isEditing, setIsEditing] = useState(false);
	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		description: "",
	});

	const { data: profile, isLoading, error, refetch } = api.user.getProfile.useQuery();
	const updateProfile = api.user.updateProfile.useMutation({
		onSuccess: () => {
			setIsEditing(false);
			refetch();
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

	if (isLoading) {
		return (
			<main className="flex min-h-screen items-center justify-center bg-stone-50">
				<div className="text-center">
					<div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-lime-900 border-t-transparent"></div>
					<p className="text-stone-600">Chargement du profil...</p>
				</div>
			</main>
		);
	}

	if (error) {
		return (
			<main className="flex min-h-screen items-center justify-center bg-stone-50">
				<div className="text-center">
					<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
						<span className="text-2xl">⚠️</span>
					</div>
					<p className="mb-2 font-semibold text-stone-800">Erreur de chargement</p>
					<p className="text-stone-600">Impossible de charger votre profil. Veuillez réessayer.</p>
				</div>
			</main>
		);
	}

	return (
		<main className="min-h-screen bg-stone-50">
			{/* Header */}
			<header className="border-b border-stone-200 bg-white">
				<div className="container mx-auto px-6 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-4">
							<Link href="/dashboard" className="text-stone-600 transition hover:text-stone-800">
								← Retour au dashboard
							</Link>
							<div className="text-2xl font-bold text-stone-800">EventMaster</div>
						</div>
						<div className="flex items-center gap-4">
							<span className="text-stone-600">
								{(profile as any)?.firstName && (profile as any)?.lastName
									? `${(profile as any).firstName} ${(profile as any).lastName}`
									: (session.user?.name ?? session.user?.email)}
							</span>
							<Link
								href="/api/auth/signout"
								className="rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-50"
							>
								Se déconnecter
							</Link>
						</div>
					</div>
				</div>
			</header>

			{/* Profile Content */}
			<div className="container mx-auto px-6 py-8">
				<div className="mx-auto max-w-2xl">
					<div className="mb-8 flex items-center justify-between">
						<div>
							<h1 className="text-3xl font-bold text-stone-800">Mon profil</h1>
							<p className="mt-2 text-stone-600">Gérez vos informations personnelles</p>
						</div>
						{!isEditing && (
							<button
								onClick={() => setIsEditing(true)}
								className="rounded-lg bg-lime-900 px-6 py-3 font-semibold text-white transition hover:bg-lime-800"
							>
								Modifier le profil
							</button>
						)}
					</div>

					{/* Profile Card */}
					<div className="rounded-xl bg-white shadow-sm">
						<div className="border-b border-stone-200 px-6 py-4">
							<h2 className="text-xl font-semibold text-stone-800">Informations personnelles</h2>
						</div>

						<div className="p-6">
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
										<div>
											<label className="mb-2 block text-sm font-medium text-stone-700">Prénom</label>
											<input
												type="text"
												value={formData.firstName}
												onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
												className="w-full rounded-lg border border-stone-300 px-3 py-2 focus:border-lime-500 focus:outline-none"
												placeholder="Votre prénom"
											/>
										</div>
										<div>
											<label className="mb-2 block text-sm font-medium text-stone-700">Nom de famille</label>
											<input
												type="text"
												value={formData.lastName}
												onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
												className="w-full rounded-lg border border-stone-300 px-3 py-2 focus:border-lime-500 focus:outline-none"
												placeholder="Votre nom de famille"
											/>
										</div>
									</div>

									<div>
										<label className="mb-2 block text-sm font-medium text-stone-700">Email</label>
										<input
											type="email"
											value={profile?.email ?? ""}
											disabled
											className="w-full cursor-not-allowed rounded-lg border border-stone-300 bg-stone-50 px-3 py-2 text-stone-500"
										/>
										<p className="mt-1 text-xs text-stone-500">L'email ne peut pas être modifié</p>
									</div>

									<div>
										<label className="mb-2 block text-sm font-medium text-stone-700">Description</label>
										<textarea
											value={formData.description}
											onChange={(e) => setFormData({ ...formData, description: e.target.value })}
											rows={4}
											className="w-full rounded-lg border border-stone-300 px-3 py-2 focus:border-lime-500 focus:outline-none"
											placeholder="Parlez-nous un peu de vous..."
										/>
									</div>

									<div className="flex gap-3 pt-4">
										<button
											type="button"
											onClick={() => {
												setIsEditing(false);
												setFormData({
													firstName: (profile as any)?.firstName ?? "",
													lastName: (profile as any)?.lastName ?? "",
													description: (profile as any)?.description ?? "",
												});
											}}
											className="flex-1 rounded-lg border border-stone-300 px-4 py-2 font-medium text-stone-700 transition hover:bg-stone-50"
										>
											Annuler
										</button>
										<button
											type="submit"
											disabled={updateProfile.isPending}
											className="flex-1 rounded-lg bg-lime-900 px-4 py-2 font-medium text-white transition hover:bg-lime-800 disabled:cursor-not-allowed disabled:opacity-50"
										>
											{updateProfile.isPending ? "Enregistrement..." : "Enregistrer"}
										</button>
									</div>
								</form>
							) : (
								<div className="space-y-6">
									<div className="grid gap-6 md:grid-cols-2">
										<div>
											<label className="mb-2 block text-sm font-medium text-stone-700">Prénom</label>
											<p className="text-stone-800">
												{(profile as any)?.firstName || <span className="text-stone-400 italic">Non renseigné</span>}
											</p>
										</div>
										<div>
											<label className="mb-2 block text-sm font-medium text-stone-700">Nom de famille</label>
											<p className="text-stone-800">
												{(profile as any)?.lastName || <span className="text-stone-400 italic">Non renseigné</span>}
											</p>
										</div>
									</div>

									<div>
										<label className="mb-2 block text-sm font-medium text-stone-700">Email</label>
										<p className="text-stone-800">{profile?.email}</p>
									</div>

									<div>
										<label className="mb-2 block text-sm font-medium text-stone-700">Description</label>
										<p className="text-stone-800">
											{(profile as any)?.description || <span className="text-stone-400 italic">Aucune description</span>}
										</p>
									</div>
								</div>
							)}

							{updateProfile.error && (
								<div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
									Erreur lors de la mise à jour du profil. Veuillez réessayer.
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</main>
	);
}
