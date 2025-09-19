"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Textarea } from "~/components/ui/textarea";
import { Badge } from "~/components/ui/badge";
import { CalendarDays, MapPin, User, Clock } from "lucide-react";

export default function InvitationPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);
	const [comment, setComment] = useState("");

	const token = searchParams.get("token");
	const email = searchParams.get("email");

	const {
		data: invitationData,
		isLoading,
		error: fetchError,
	} = api.invitation.getInvitationDetails.useQuery({ shareToken: token!, email: email! }, { enabled: !!token && !!email });

	const respondMutation = api.invitation.respondToInvitation.useMutation({
		onSuccess: () => {
			setSuccess(true);
			setError(null);
		},
		onError: (err) => {
			setError(err.message);
			setSuccess(false);
		},
		onSettled: () => {
			setLoading(false);
		},
	});

	const handleResponse = async (response: "YES" | "NO" | "MAYBE") => {
		if (!token || !email) return;

		setLoading(true);
		setError(null);

		respondMutation.mutate({
			shareToken: token,
			email: email,
			response,
			comment: comment.trim() || undefined,
		});
	};

	if (!token || !email) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
				<Card className="w-full max-w-md">
					<CardHeader>
						<CardTitle className="text-center text-red-600">Lien invalide</CardTitle>
						<CardDescription className="text-center">Ce lien d'invitation n'est pas valide ou a expiré.</CardDescription>
					</CardHeader>
				</Card>
			</div>
		);
	}

	if (isLoading) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
				<Card className="w-full max-w-2xl">
					<CardContent className="p-8">
						<div className="text-center">Chargement de votre invitation...</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	if (fetchError || !invitationData) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
				<Card className="w-full max-w-md">
					<CardHeader>
						<CardTitle className="text-center text-red-600">Invitation introuvable</CardTitle>
						<CardDescription className="text-center">Cette invitation n'existe pas ou a été supprimée.</CardDescription>
					</CardHeader>
				</Card>
			</div>
		);
	}

	const { event, invitation } = invitationData;

	return (
		<div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
			<Card className="w-full max-w-2xl">
				<CardHeader>
					<CardTitle className="text-center text-2xl font-bold text-gray-900">Vous êtes invité à un événement !</CardTitle>
					<CardDescription className="text-center">
						{invitation.name ? `Bonjour ${invitation.name}, vous` : "Vous"} êtes invité(e) par{" "}
						<span className="font-medium">{event.organizerName}</span>
					</CardDescription>
				</CardHeader>

				<CardContent className="space-y-6">
					{/* Event Details */}
					<div className="space-y-4">
						<h3 className="text-xl font-semibold text-gray-900">{event.title}</h3>

						{event.description && <p className="text-gray-600">{event.description}</p>}

						<div className="grid gap-3">
							<div className="flex items-center gap-2 text-sm text-gray-600">
								<CalendarDays className="h-4 w-4" />
								<span>
									{new Date(event.startDate).toLocaleString("fr-FR", {
										dateStyle: "full",
										timeStyle: "short",
									})}
								</span>
							</div>

							{event.endDate && (
								<div className="flex items-center gap-2 text-sm text-gray-600">
									<Clock className="h-4 w-4" />
									<span>
										Fin:{" "}
										{new Date(event.endDate).toLocaleString("fr-FR", {
											dateStyle: "full",
											timeStyle: "short",
										})}
									</span>
								</div>
							)}

							{event.location && (
								<div className="flex items-center gap-2 text-sm text-gray-600">
									<MapPin className="h-4 w-4" />
									<span>{event.location}</span>
								</div>
							)}

							<div className="flex items-center gap-2 text-sm text-gray-600">
								<User className="h-4 w-4" />
								<span>Organisé par {event.organizerName}</span>
							</div>
						</div>

						{invitation.role === "ORGANIZER" && <Badge variant="secondary">Vous êtes co-organisateur</Badge>}
					</div>

					{/* Show current response if any */}
					{invitation.hasResponded && invitation.response && (
						<div className="rounded-lg bg-blue-50 p-4">
							<h4 className="font-medium text-blue-900">Votre réponse actuelle</h4>
							<p className="text-blue-700">
								{invitation.response.response === "YES" && "Vous avez accepté cette invitation"}
								{invitation.response.response === "NO" && "Vous avez décliné cette invitation"}
								{invitation.response.response === "MAYBE" && 'Vous avez répondu "Peut-être"'}
							</p>
							{invitation.response.comment && (
								<p className="mt-1 text-sm text-blue-600">Commentaire: "{invitation.response.comment}"</p>
							)}
							<p className="mt-2 text-xs text-blue-500">Vous pouvez modifier votre réponse ci-dessous.</p>
						</div>
					)}

					{/* Response Form */}
					{success ? (
						<div className="rounded-lg bg-green-50 p-4 text-center">
							<h4 className="font-medium text-green-900">Réponse enregistrée !</h4>
							<p className="text-green-700">Merci pour votre réponse.</p>
						</div>
					) : (
						<div className="space-y-4">
							<h4 className="font-medium text-gray-900">Votre réponse</h4>

							{error && (
								<div className="rounded-lg bg-red-50 p-4">
									<p className="text-red-700">{error}</p>
								</div>
							)}

							<div className="space-y-3">
								<div className="flex gap-3">
									<Button
										onClick={() => handleResponse("YES")}
										disabled={loading}
										className="flex-1 bg-green-600 hover:bg-green-700"
									>
										{loading ? "Envoi..." : "Oui, je participe"}
									</Button>
									<Button onClick={() => handleResponse("MAYBE")} disabled={loading} variant="outline" className="flex-1">
										{loading ? "Envoi..." : "Peut-être"}
									</Button>
									<Button onClick={() => handleResponse("NO")} disabled={loading} variant="outline" className="flex-1">
										{loading ? "Envoi..." : "Non, désolé"}
									</Button>
								</div>

								<div className="space-y-2">
									<label htmlFor="comment" className="text-sm font-medium text-gray-700">
										Commentaire (optionnel)
									</label>
									<Textarea
										id="comment"
										placeholder="Laissez un message à l'organisateur..."
										value={comment}
										onChange={(e) => setComment(e.target.value)}
										disabled={loading}
										rows={3}
									/>
								</div>
							</div>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
