"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type Session } from "next-auth";
import { api } from "~/trpc/react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { Separator } from "~/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Label } from "~/components/ui/label";
import { Header } from "~/components/ui/header";

interface DashboardProps {
	session: Session;
}

export default function Dashboard({ session }: DashboardProps) {
	const router = useRouter();
	const [formData, setFormData] = useState({
		title: "",
		description: "",
		startDate: "",
		endDate: "",
		location: "",
	});
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	const { data: events, isLoading, error, refetch } = api.event.getAll.useQuery();
	const createEvent = api.event.create.useMutation({
		onSuccess: () => {
			setFormData({
				title: "",
				description: "",
				startDate: "",
				endDate: "",
				location: "",
			});
			setIsDialogOpen(false);
			void refetch();
		},
	});

	const userEvents =
		events?.map((event) => ({
			id: event.id,
			title: event.title,
			date: event.startDate.toISOString().split("T")[0],
			time: event.startDate.toTimeString().slice(0, 5),
			location: event.location ?? "À définir",
			participants: event.invitations.reduce((acc, inv) => acc + inv.responses.length, 0),
			status: event.status === "PUBLISHED" ? "created" : "joined",
			eventStatus: event.status,
			type: "meeting",
		})) ?? [];

	if (isLoading) {
		return (
			<main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50">
				<Card className="w-full max-w-md text-center">
					<CardContent className="pt-6">
						<div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
						<p className="text-slate-600">Chargement de votre dashboard...</p>
					</CardContent>
				</Card>
			</main>
		);
	}

	if (error) {
		return (
			<main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50">
				<Card className="w-full max-w-md text-center border-red-200">
					<CardContent className="pt-6">
						<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
							<span className="text-2xl">⚠️</span>
						</div>
						<CardTitle className="mb-2 text-slate-800">Erreur de chargement</CardTitle>
						<p className="text-slate-600">Impossible de charger vos événements. Veuillez réessayer.</p>
						<Button
							variant="outline"
							className="mt-4"
							onClick={() => window.location.reload()}
						>
							Réessayer
						</Button>
					</CardContent>
				</Card>
			</main>
		);
	}

	return (
		<main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50">
			<Header session={session} mounted={true} />

			{/* Dashboard Content */}
			<div className="container mx-auto px-6 py-8">
				{/* Welcome Section */}
				<div className="mb-8">
					<Card className="bg-gradient-to-r rounded-xl from-blue-600 to-purple-600 border-0 text-white">
						<CardContent className="p-8">
							<div className="flex items-center justify-between">
								<div>
									<h1 className="text-3xl font-bold mb-2">
										Bonjour {session.user?.name?.split(' ')[0] ?? 'Utilisateur'} ! 👋
									</h1>
									<p className="text-blue-100 text-lg">
										Gérez vos événements et créez des expériences extraordinaires
									</p>
								</div>
								<div className="hidden md:block">
									<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
										<DialogTrigger asChild>
											<Button size="lg" variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-white/30">
												<svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
												</svg>
												Créer un événement
											</Button>
										</DialogTrigger>
										<DialogContent className="sm:max-w-md">
											<DialogHeader>
												<DialogTitle>Créer un nouvel événement</DialogTitle>
											</DialogHeader>
											<form
												onSubmit={(e) => {
													e.preventDefault();
													createEvent.mutate({
														title: formData.title,
														description: formData.description || undefined,
														startDate: new Date(formData.startDate),
														endDate: formData.endDate ? new Date(formData.endDate) : undefined,
														location: formData.location || undefined,
													});
												}}
												className="space-y-4"
											>
												<div>
													<Label htmlFor="title">Titre *</Label>
													<Input
														id="title"
														required
														value={formData.title}
														onChange={(e) => setFormData({ ...formData, title: e.target.value })}
														placeholder="Ex: Réunion équipe"
													/>
												</div>

												<div>
													<Label htmlFor="description">Description</Label>
													<Textarea
														id="description"
														value={formData.description}
														onChange={(e) => setFormData({ ...formData, description: e.target.value })}
														rows={3}
														placeholder="Décrivez votre événement..."
													/>
												</div>

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

												<div>
													<Label htmlFor="location">Lieu</Label>
													<Input
														id="location"
														value={formData.location}
														onChange={(e) => setFormData({ ...formData, location: e.target.value })}
														placeholder="Ex: Salle de conférence A"
													/>
												</div>

												<div className="flex gap-3 pt-4">
													<Button
														type="button"
														variant="outline"
														className="flex-1"
														onClick={() => setIsDialogOpen(false)}
													>
														Annuler
													</Button>
													<Button
														type="submit"
														disabled={createEvent.isPending || !formData.title || !formData.startDate}
														className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
													>
														{createEvent.isPending ? "Création..." : "Créer"}
													</Button>
												</div>

												{createEvent.error && (
													<div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
														Erreur lors de la création de l'événement. Veuillez réessayer.
													</div>
												)}
											</form>
										</DialogContent>
									</Dialog>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Stats Cards */}
				<div className="mb-8 grid gap-6 md:grid-cols-3">
					<Card className="group rounded-xl hover:shadow-xl transition-all duration-300 border-0 shadow-md hover:shadow-blue-500/10">
						<CardContent className="p-6">
							<div className="flex items-center gap-4">
								<div className="rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 p-3 shadow-lg group-hover:scale-110 transition-transform">
									<svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
									</svg>
								</div>
								<div>
									<p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
										{userEvents.filter((e) => e.status === "created").length}
									</p>
									<p className="text-slate-600 font-medium">Événements créés</p>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card className="group rounded-xl hover:shadow-xl transition-all duration-300 border-0 shadow-md hover:shadow-purple-500/10">
						<CardContent className="p-6">
							<div className="flex items-center gap-4">
								<div className="rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 p-3 shadow-lg group-hover:scale-110 transition-transform">
									<svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
									</svg>
								</div>
								<div>
									<p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
										{userEvents.filter((e) => e.status === "joined").length}
									</p>
									<p className="text-slate-600 font-medium">Événements rejoints</p>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card className="group rounded-xl hover:shadow-xl transition-all duration-300 border-0 shadow-md hover:shadow-emerald-500/10">
						<CardContent className="p-6">
							<div className="flex items-center gap-4">
								<div className="rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 p-3 shadow-lg group-hover:scale-110 transition-transform">
									<svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
									</svg>
								</div>
								<div>
									<p className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
										{userEvents.reduce((acc, e) => acc + e.participants, 0)}
									</p>
									<p className="text-slate-600 font-medium">Total participants</p>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Events List */}
				<Card className={`border-0 shadow-md ${userEvents.length === 0 ? 'rounded-t-xl' : 'rounded-xl'}`}>
					<CardHeader className={`border-b border-slate-100 ${userEvents.length === 0 ? 'rounded-t-xl' : 'rounded-t-xl'}`}>
						<div className="flex items-center justify-between">
							<CardTitle className="text-2xl text-slate-900">Mes événements</CardTitle>
							<Badge variant="secondary" className="bg-slate-100 text-slate-700">
								{userEvents.length} événement{userEvents.length > 1 ? 's' : ''}
							</Badge>
						</div>
					</CardHeader>
					<CardContent className="p-0">
						<div className="divide-y divide-slate-100">
							{userEvents.map((event) => (
								<div key={event.id} className="group p-6 transition-all hover:bg-slate-50/50">
									<div className="flex items-center justify-between">
										<div className="flex items-start gap-4">
											<div className="rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 p-3 group-hover:scale-105 transition-transform">
												<span className="text-xl">
													{event.type === "meeting" ? "💼" : event.type === "celebration" ? "🎉" : "📚"}
												</span>
											</div>
											<div className="flex-1">
												<div className="flex items-center gap-3 mb-2">
													<h3 className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
														{event.title}
													</h3>
													<Badge
														variant={event.status === "created" ? "default" : "secondary"}
														className={event.status === "created"
															? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
															: "bg-slate-100 text-slate-700"
														}
													>
														{event.status === "created" ? "Organisateur" : "Participant"}
													</Badge>
													<Badge
														variant="outline"
														className={
															event.eventStatus === "PUBLISHED"
																? "border-green-200 bg-green-50 text-green-700"
																: event.eventStatus === "DRAFT"
																? "border-yellow-200 bg-yellow-50 text-yellow-700"
																: event.eventStatus === "CANCELLED"
																? "border-red-200 bg-red-50 text-red-700"
																: "border-gray-200 bg-gray-50 text-gray-700"
														}
													>
														{event.eventStatus === "PUBLISHED" && "🌟 Publié"}
														{event.eventStatus === "DRAFT" && "📝 Brouillon"}
														{event.eventStatus === "CANCELLED" && "❌ Annulé"}
														{event.eventStatus === "COMPLETED" && "✅ Terminé"}
													</Badge>
												</div>
												<div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-slate-600">
													<div className="flex items-center gap-2">
														<svg className="h-4 w-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
															<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
														</svg>
														<span>
															{event.date ? new Date(event.date).toLocaleDateString("fr-FR") : "Date à définir"} à {event.time}
														</span>
													</div>
													<div className="flex items-center gap-2">
														<svg className="h-4 w-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
															<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
															<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
														</svg>
														<span>{event.location}</span>
													</div>
													<div className="flex items-center gap-2">
														<svg className="h-4 w-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
															<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
														</svg>
														<span>{event.participants} participant{event.participants > 1 ? 's' : ''}</span>
													</div>
												</div>
											</div>
										</div>
										<div className="flex items-center gap-2">
											<Button
												variant="outline"
												size="sm"
												className="border-slate-300 hover:bg-slate-50"
												onClick={() => router.push(`/event/${event.id}/settings`)}
											>
												<svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
												</svg>
												Paramètres
											</Button>
											{event.status === "created" && (
												<Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
													<svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
														<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
													</svg>
													Gérer
												</Button>
											)}
										</div>
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>

				{/* Empty State */}
				{userEvents.length === 0 && (
					<Card className="border-0 shadow-md rounded-b-xl -mt-1">
						<CardContent className="py-16 text-center">
							<div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-purple-100">
								<svg className="h-10 w-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
								</svg>
							</div>
							<h3 className="mb-3 text-2xl font-bold text-slate-900">Aucun événement pour le moment</h3>
							<p className="mb-8 text-lg text-slate-600 max-w-md mx-auto">
								Créez votre premier événement et commencez à organiser des expériences extraordinaires
							</p>
							<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
								<DialogTrigger asChild>
									<Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-4 text-lg shadow-lg shadow-blue-500/25">
										<svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
										</svg>
										Créer mon premier événement
									</Button>
								</DialogTrigger>
								<DialogContent className="sm:max-w-md">
									<DialogHeader>
										<DialogTitle>Créer un nouvel événement</DialogTitle>
									</DialogHeader>
									<form
										onSubmit={(e) => {
											e.preventDefault();
											createEvent.mutate({
												title: formData.title,
												description: formData.description || undefined,
												startDate: new Date(formData.startDate),
												endDate: formData.endDate ? new Date(formData.endDate) : undefined,
												location: formData.location || undefined,
											});
										}}
										className="space-y-4"
									>
										<div>
											<Label htmlFor="title" className="mb-2">Titre *</Label>
											<Input
												id="title"
												required
												value={formData.title}
												onChange={(e) => setFormData({ ...formData, title: e.target.value })}
												placeholder="Ex: Réunion équipe"
											/>
										</div>

										<div>
											<Label htmlFor="description" className="mb-2">Description</Label>
											<Textarea
												id="description"
												value={formData.description}
												onChange={(e) => setFormData({ ...formData, description: e.target.value })}
												rows={3}
												placeholder="Décrivez votre événement..."
											/>
										</div>

										<div>
											<Label htmlFor="startDate" className="mb-2">Date de début *</Label>
											<Input
												id="startDate"
												type="datetime-local"
												required
												value={formData.startDate}
												onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
											/>
										</div>

										<div>
											<Label htmlFor="endDate" className="mb-2">Date de fin</Label>
											<Input
												id="endDate"
												type="datetime-local"
												value={formData.endDate}
												onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
											/>
										</div>

										<div>
											<Label htmlFor="location" className="mb-2">Lieu</Label>
											<Input
												id="location"
												value={formData.location}
												onChange={(e) => setFormData({ ...formData, location: e.target.value })}
												placeholder="Ex: Salle de conférence A"
											/>
										</div>

										<div className="flex gap-3 pt-4">
											<Button
												type="button"
												variant="outline"
												className="flex-1"
												onClick={() => setIsDialogOpen(false)}
											>
												Annuler
											</Button>
											<Button
												type="submit"
												disabled={createEvent.isPending || !formData.title || !formData.startDate}
												className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
											>
												{createEvent.isPending ? "Création..." : "Créer"}
											</Button>
										</div>

										{createEvent.error && (
											<div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
												Erreur lors de la création de l'événement. Veuillez réessayer.
											</div>
										)}
									</form>
								</DialogContent>
							</Dialog>
						</CardContent>
					</Card>
				)}

				{/* Mobile Create Button */}
				<div className="fixed bottom-6 right-6 md:hidden">
					<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
						<DialogTrigger asChild>
							<Button size="lg" className="h-14 w-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/25">
								<svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
								</svg>
							</Button>
						</DialogTrigger>
						<DialogContent className="sm:max-w-md">
							<DialogHeader>
								<DialogTitle>Créer un nouvel événement</DialogTitle>
							</DialogHeader>
							<form
								onSubmit={(e) => {
									e.preventDefault();
									createEvent.mutate({
										title: formData.title,
										description: formData.description || undefined,
										startDate: new Date(formData.startDate),
										endDate: formData.endDate ? new Date(formData.endDate) : undefined,
										location: formData.location || undefined,
									});
								}}
								className="space-y-4"
							>
								<div>
									<Label htmlFor="title-mobile" className="mb-2">Titre *</Label>
									<Input
										id="title-mobile"
										required
										value={formData.title}
										onChange={(e) => setFormData({ ...formData, title: e.target.value })}
										placeholder="Ex: Réunion équipe"
									/>
								</div>

								<div>
									<Label htmlFor="description-mobile" className="mb-2">Description</Label>
									<Textarea
										id="description-mobile"
										value={formData.description}
										onChange={(e) => setFormData({ ...formData, description: e.target.value })}
										rows={3}
										placeholder="Décrivez votre événement..."
									/>
								</div>

								<div>
									<Label htmlFor="startDate-mobile" className="mb-2">Date de début *</Label>
									<Input
										id="startDate-mobile"
										type="datetime-local"
										required
										value={formData.startDate}
										onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
									/>
								</div>

								<div>
									<Label htmlFor="endDate-mobile" className="mb-2">Date de fin</Label>
									<Input
										id="endDate-mobile"
										type="datetime-local"
										value={formData.endDate}
										onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
									/>
								</div>

								<div>
									<Label htmlFor="location-mobile" className="mb-2">Lieu</Label>
									<Input
										id="location-mobile"
										value={formData.location}
										onChange={(e) => setFormData({ ...formData, location: e.target.value })}
										placeholder="Ex: Salle de conférence A"
									/>
								</div>

								<div className="flex gap-3 pt-4">
									<Button
										type="button"
										variant="outline"
										className="flex-1"
										onClick={() => setIsDialogOpen(false)}
									>
										Annuler
									</Button>
									<Button
										type="submit"
										disabled={createEvent.isPending || !formData.title || !formData.startDate}
										className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
									>
										{createEvent.isPending ? "Création..." : "Créer"}
									</Button>
								</div>

								{createEvent.error && (
									<div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
										Erreur lors de la création de l'événement. Veuillez réessayer.
									</div>
								)}
							</form>
						</DialogContent>
					</Dialog>
				</div>
			</div>
		</main>
	);
}
