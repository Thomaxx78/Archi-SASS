"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Label } from "~/components/ui/label";
import { Header } from "~/components/ui/header";
import { Badge } from "~/components/ui/badge";

interface EventSettingsPageProps {
	params: Promise<{ id: string }>;
}

export default function EventSettingsPage({ params }: EventSettingsPageProps) {
	const { id } = use(params);
	const router = useRouter();
	const { data: session } = useSession();
	const [isEditing, setIsEditing] = useState(false);

	const { data: event, isLoading, error, refetch } = api.event.getById.useQuery({
		id,
	});

	const updateEvent = api.event.update.useMutation({
		onSuccess: () => {
			setIsEditing(false);
			void refetch();
		},
	});

	const updateStatus = api.event.updateStatus.useMutation({
		onSuccess: () => {
			void refetch();
		},
	});

	const [formData, setFormData] = useState({
		title: event?.title || "",
		description: event?.description || "",
		startDate: event?.startDate ? new Date(event.startDate).toISOString().slice(0, 16) : "",
		endDate: event?.endDate ? new Date(event.endDate).toISOString().slice(0, 16) : "",
		location: event?.location || "",
	});

	// Update form data when event loads
	if (event && !isEditing && formData.title === "") {
		setFormData({
			title: event.title,
			description: event.description || "",
			startDate: new Date(event.startDate).toISOString().slice(0, 16),
			endDate: event.endDate ? new Date(event.endDate).toISOString().slice(0, 16) : "",
			location: event.location || "",
		});
	}

	const handleSave = () => {
		updateEvent.mutate({
			id,
			title: formData.title,
			description: formData.description || undefined,
			startDate: new Date(formData.startDate),
			endDate: formData.endDate ? new Date(formData.endDate) : undefined,
			location: formData.location || undefined,
		});
	};

	const handleStatusChange = (status: 'DRAFT' | 'PUBLISHED' | 'CANCELLED' | 'COMPLETED') => {
		updateStatus.mutate({
			id,
			status,
		});
	};

	if (isLoading) {
		return (
			<main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50">
				<Card className="w-full max-w-md text-center">
					<CardContent className="pt-6">
						<div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
						<p className="text-slate-600">Chargement de l'événement...</p>
					</CardContent>
				</Card>
			</main>
		);
	}

	if (error || !event) {
		return (
			<main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50">
				<Card className="w-full max-w-md text-center border-red-200">
					<CardContent className="pt-6">
						<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
							<span className="text-2xl">⚠️</span>
						</div>
						<CardTitle className="mb-2 text-slate-800">Événement introuvable</CardTitle>
						<p className="text-slate-600">Cet événement n'existe pas ou vous n'avez pas l'autorisation de le modifier.</p>
						<Button
							variant="outline"
							className="mt-4"
							onClick={() => router.push('/')}
						>
							Retour au dashboard
						</Button>
					</CardContent>
				</Card>
			</main>
		);
	}

	return (
		<main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50">
			<Header session={session!} mounted={true} />

			<div className="container mx-auto px-6 py-8">
				{/* Header */}
				<div className="mb-8 flex items-center justify-between">
					<div>
						<Button
							variant="ghost"
							onClick={() => router.push('/')}
							className="mb-4 text-slate-600 hover:text-slate-800"
						>
							<svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
							</svg>
							Retour au dashboard
						</Button>
						<h1 className="text-3xl font-bold text-slate-900">Paramètres de l'événement</h1>
						<p className="mt-2 text-slate-600">Modifiez les informations de votre événement</p>
					</div>
					<div className="flex items-center gap-3">
						<Badge
							variant={event.status === 'PUBLISHED' ? 'default' : 'secondary'}
							className={event.status === 'PUBLISHED'
								? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
								: "bg-slate-100 text-slate-700"
							}
						>
							{event.status === 'PUBLISHED' ? 'Publié' :
							 event.status === 'DRAFT' ? 'Brouillon' :
							 event.status === 'CANCELLED' ? 'Annulé' : 'Terminé'}
						</Badge>
					</div>
				</div>

				<div className="grid gap-8 lg:grid-cols-3">
					{/* Main Settings */}
					<div className="lg:col-span-2">
						<Card className="border-0 shadow-md">
							<CardHeader className="flex flex-row items-center justify-between">
								<CardTitle className="text-xl">Informations générales</CardTitle>
								{!isEditing ? (
									<Button
										variant="outline"
										onClick={() => setIsEditing(true)}
									>
										<svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
										</svg>
										Modifier
									</Button>
								) : (
									<div className="flex gap-2">
										<Button
											variant="outline"
											onClick={() => {
												setIsEditing(false);
												setFormData({
													title: event.title,
													description: event.description || "",
													startDate: new Date(event.startDate).toISOString().slice(0, 16),
													endDate: event.endDate ? new Date(event.endDate).toISOString().slice(0, 16) : "",
													location: event.location || "",
												});
											}}
										>
											Annuler
										</Button>
										<Button
											onClick={handleSave}
											disabled={updateEvent.isPending || !formData.title || !formData.startDate}
											className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
										>
											{updateEvent.isPending ? "Enregistrement..." : "Enregistrer"}
										</Button>
									</div>
								)}
							</CardHeader>
							<CardContent className="space-y-6">
								{!isEditing ? (
									<>
										<div>
											<Label className="text-sm font-medium text-slate-600">Titre</Label>
											<p className="mt-1 text-lg font-semibold text-slate-900">{event.title}</p>
										</div>

										{event.description && (
											<div>
												<Label className="text-sm font-medium text-slate-600">Description</Label>
												<p className="mt-1 text-slate-700">{event.description}</p>
											</div>
										)}

										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											<div>
												<Label className="text-sm font-medium text-slate-600">Date de début</Label>
												<p className="mt-1 text-slate-900">
													{new Date(event.startDate).toLocaleString("fr-FR")}
												</p>
											</div>
											{event.endDate && (
												<div>
													<Label className="text-sm font-medium text-slate-600">Date de fin</Label>
													<p className="mt-1 text-slate-900">
														{new Date(event.endDate).toLocaleString("fr-FR")}
													</p>
												</div>
											)}
										</div>

										{event.location && (
											<div>
												<Label className="text-sm font-medium text-slate-600">Lieu</Label>
												<p className="mt-1 text-slate-900">{event.location}</p>
											</div>
										)}
									</>
								) : (
									<>
										<div>
											<Label htmlFor="title">Titre *</Label>
											<Input
												id="title"
												required
												value={formData.title}
												onChange={(e) => setFormData({ ...formData, title: e.target.value })}
												placeholder="Titre de l'événement"
											/>
										</div>

										<div>
											<Label htmlFor="description">Description</Label>
											<Textarea
												id="description"
												value={formData.description}
												onChange={(e) => setFormData({ ...formData, description: e.target.value })}
												rows={4}
												placeholder="Décrivez votre événement..."
											/>
										</div>

										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											<div>
												<Label htmlFor="startDate">Date de début *</Label>
												<Input
													id="startDate"
													type="datetime-local"
													required
													value={formData.startDate}
													onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
												/>
											</div>
											<div>
												<Label htmlFor="endDate">Date de fin</Label>
												<Input
													id="endDate"
													type="datetime-local"
													value={formData.endDate}
													onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
												/>
											</div>
										</div>

										<div>
											<Label htmlFor="location">Lieu</Label>
											<Input
												id="location"
												value={formData.location}
												onChange={(e) => setFormData({ ...formData, location: e.target.value })}
												placeholder="Lieu de l'événement"
											/>
										</div>
									</>
								)}

								{updateEvent.error && (
									<div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
										Erreur lors de la mise à jour. Veuillez réessayer.
									</div>
								)}
							</CardContent>
						</Card>
					</div>

					{/* Status & Actions */}
					<div className="lg:col-span-1">
						<Card className="border-0 shadow-md">
							<CardHeader>
								<CardTitle className="text-xl">Statut et actions</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div>
									<Label className="text-sm font-medium text-slate-600 mb-3 block">
										Changer le statut
									</Label>
									<div className="space-y-2">
										<Button
											variant={event.status === 'DRAFT' ? 'default' : 'outline'}
											size="sm"
											className="w-full justify-start"
											onClick={() => handleStatusChange('DRAFT')}
											disabled={updateStatus.isPending}
										>
											📝 Brouillon
										</Button>
										<Button
											variant={event.status === 'PUBLISHED' ? 'default' : 'outline'}
											size="sm"
											className="w-full justify-start"
											onClick={() => handleStatusChange('PUBLISHED')}
											disabled={updateStatus.isPending}
										>
											🌟 Publié
										</Button>
										<Button
											variant={event.status === 'CANCELLED' ? 'default' : 'outline'}
											size="sm"
											className="w-full justify-start"
											onClick={() => handleStatusChange('CANCELLED')}
											disabled={updateStatus.isPending}
										>
											❌ Annulé
										</Button>
										<Button
											variant={event.status === 'COMPLETED' ? 'default' : 'outline'}
											size="sm"
											className="w-full justify-start"
											onClick={() => handleStatusChange('COMPLETED')}
											disabled={updateStatus.isPending}
										>
											✅ Terminé
										</Button>
									</div>
								</div>

								<div className="pt-4 border-t">
									<Label className="text-sm font-medium text-slate-600 mb-3 block">
										Statistiques
									</Label>
									<div className="space-y-2 text-sm">
										<div className="flex justify-between">
											<span className="text-slate-600">Invitations:</span>
											<span className="font-medium">{event.invitations.length}</span>
										</div>
										<div className="flex justify-between">
											<span className="text-slate-600">Réponses:</span>
											<span className="font-medium">
												{event.invitations.reduce((acc, inv) => acc + inv.responses.length, 0)}
											</span>
										</div>
										<div className="flex justify-between">
											<span className="text-slate-600">Créé le:</span>
											<span className="font-medium">
												{new Date(event.createdAt).toLocaleDateString("fr-FR")}
											</span>
										</div>
									</div>
								</div>

								{updateStatus.error && (
									<div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
										Erreur lors du changement de statut.
									</div>
								)}
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</main>
	);
}