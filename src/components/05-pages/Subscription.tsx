"use client";

import { type Session } from "next-auth";
import { useState } from "react";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { Header } from "~/components/ui/header";
import { BackButton } from "~/components/ui/back-button";
import { StripeProvider } from "~/components/providers/stripe-provider";
import StripePaymentForm from "~/components/forms/stripe-payment-form";
import { PlanCard } from "~/components/subscription/plan-card";
import { SubscriptionSummary } from "~/components/subscription/subscription-summary";

interface SubscriptionProps {
	session: Session;
	profile: any;
	mounted: boolean;
}

export default function Subscription({ session, profile, mounted }: SubscriptionProps) {
	const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
	const [showPaymentForm, setShowPaymentForm] = useState(false);
	const [result, setResult] = useState<{ success: boolean; message: string; client_secret?: string | null } | null>(null);
	const [isLoadingSetupIntent, setIsLoadingSetupIntent] = useState(false);

	const { data: plans, isLoading: isLoadingPlans } = api.subscription.getPlans.useQuery();

	const { data: currentSubscription } = api.subscription.getCurrentSubscription.useQuery();

	const createSubscription = api.subscription.createSubscription.useMutation({
		onSuccess: (data) => {
			setResult({
				success: true,
				message: `Abonnement créé avec succès ! ID: ${data.subscriptionId}, Status: ${data.status}`,
				client_secret: data.clientSecret,
			});
			setIsLoadingSetupIntent(false);
		},
		onError: (error) => {
			setResult({
				success: false,
				message: `Erreur: ${error.message}`,
			});
			setIsLoadingSetupIntent(false);
		},
	});

	const updateSubscription = api.subscription.updateSubscription.useMutation({
		onSuccess: (data) => {
			if (data.clientSecret) {
				setResult({
					success: true,
					message: `Abonnement en cours de mise à jour vers le plan ${data.newPlan.name}. Veuillez confirmer le paiement.`,
					client_secret: data.clientSecret,
				});
				setShowPaymentForm(true);
				setIsLoadingSetupIntent(false);
			} else {
				setResult({
					success: true,
					message: `Abonnement mis à jour avec succès vers le plan ${data.newPlan.name} !`,
				});
				setSelectedPlan(null);
				setShowPaymentForm(false);
				window.location.reload();
			}
		},
		onError: (error) => {
			setResult({
				success: false,
				message: `Erreur: ${error.message}`,
			});
			setIsLoadingSetupIntent(false);
		},
	});

	const createFreeSubscription = api.subscription.createFreeSubscription.useMutation({
		onSuccess: (data) => {
			setResult({
				success: true,
				message: `Abonnement gratuit activé avec succès !`,
			});
			setSelectedPlan(null);
			setShowPaymentForm(false);
			window.location.reload();
		},
		onError: (error) => {
			setResult({
				success: false,
				message: `Erreur: ${error.message}`,
			});
		},
	});

	const handlePlanSelection = (planId: string) => {
		setSelectedPlan(planId);
		setResult(null);
	};

	const handleProceedToPayment = async () => {
		if (!selectedPlan) return;

		const selectedPlanData = plans?.find((p) => p.id === selectedPlan);
		if (!selectedPlanData) return;

		if (!selectedPlanData.isStripe) {
			try {
				await createFreeSubscription.mutateAsync();
			} catch (error) {
				console.error("Erreur lors de la création du plan gratuit:", error);
			}
			return;
		}

		if (currentSubscription && currentSubscription.status === "active") {
			try {
				setIsLoadingSetupIntent(true);
				await updateSubscription.mutateAsync({
					newPriceId: selectedPlanData.priceId!,
				});
			} catch (error) {
				console.error("Erreur lors de la mise à jour:", error);
				setIsLoadingSetupIntent(false);
			}
		} else {
			setIsLoadingSetupIntent(true);
			await createSubscription.mutateAsync({
				priceId: selectedPlanData.priceId!,
				customerId: "",
				paymentMethodId: "",
			});
			setShowPaymentForm(true);
		}
	};

	const handlePaymentSuccess = async (paymentIntent: any) => {
		if (!selectedPlan) return;
		try {
			console.log("Payment succeeded:", paymentIntent);
		} catch (error) {
			console.error("Error after payment success:", error);
		}
	};

	const handlePaymentError = (error: string) => {
		setResult({
			success: false,
			message: `Erreur de paiement: ${error}`,
		});
	};

	const handleBackToPlanSelection = () => {
		setShowPaymentForm(false);
		setSelectedPlan(null);
		setResult(null);
	};

	const selectedPlanData = plans?.find((p) => p.id === selectedPlan);

	if (isLoadingPlans) {
		return (
			<main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50">
				<Card className="w-full max-w-md text-center">
					<CardContent className="pt-6">
						<div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
						<p className="text-slate-600">Chargement des plans d'abonnement...</p>
					</CardContent>
				</Card>
			</main>
		);
	}

	return (
		<main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50">
			<Header session={session} profile={profile} mounted={mounted} />
			<BackButton href="/profile" label="Retour au profil" />

			<div className="container mx-auto px-6 py-8">
				<div className="mx-auto max-w-6xl">
					{/* En-tête */}
					<div className="mb-8 text-center">
						<h1 className="mb-4 text-4xl font-bold text-slate-900">
							{currentSubscription ? "Modifier votre abonnement" : "Choisissez votre plan"}
						</h1>
						<p className="text-lg text-slate-600">
							{currentSubscription
								? "Modifiez votre plan d'abonnement selon vos besoins"
								: "Sélectionnez le plan qui correspond le mieux à vos besoins"}
						</p>
					</div>

					{!showPaymentForm ? (
						<div className="grid gap-8 lg:grid-cols-3">
							{/* Sélection des plans - 2/3 de l'espace */}
							<div className="lg:col-span-2">
								<h2 className="mb-6 text-2xl font-semibold text-slate-900">Plans disponibles</h2>
								<div className="grid gap-6 md:grid-cols-2">
									{plans?.map((plan) => (
										<PlanCard
											key={plan.id}
											plan={plan}
											isSelected={selectedPlan === plan.id}
											onSelect={handlePlanSelection}
											isCurrentPlan={currentSubscription?.plan?.id === plan.id}
										/>
									))}
								</div>
							</div>

							{/* Résumé - 1/3 de l'espace */}
							<div className="lg:col-span-1">
								{selectedPlanData ? (
									<div className="sticky top-8 space-y-6">
										<SubscriptionSummary selectedPlan={selectedPlanData} currentSubscription={currentSubscription} />

										<Button
											onClick={handleProceedToPayment}
											disabled={!selectedPlan || updateSubscription.isPending}
											size="lg"
											className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
										>
											<svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
												/>
											</svg>
											{updateSubscription.isPending || createFreeSubscription.isPending
												? "Mise à jour..."
												: currentSubscription?.plan?.id === selectedPlan
													? "Plan identique"
													: selectedPlanData?.isStripe === false
														? "Sélectionner le plan gratuit"
														: currentSubscription && currentSubscription.status === "active"
															? "Mettre à jour l'abonnement"
															: "Procéder au paiement"}
										</Button>
									</div>
								) : (
									<Card className="rounded-xl border-0 shadow-md">
										<CardContent className="p-6 text-center">
											<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
												<svg className="h-8 w-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
													/>
												</svg>
											</div>
											<h3 className="mb-2 text-lg font-medium text-slate-900">Sélectionnez un plan</h3>
											<p className="text-sm text-slate-600">
												Choisissez un plan à gauche pour voir le résumé et procéder au paiement.
											</p>
										</CardContent>
									</Card>
								)}
							</div>
						</div>
					) : (
						/* Formulaire de paiement */
						<div className="mx-auto max-w-2xl">
							<div className="mb-6 flex items-center gap-4">
								<Button variant="outline" onClick={handleBackToPlanSelection}>
									<svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
									</svg>
									Retour à la sélection
								</Button>
								<h2 className="text-2xl font-semibold text-slate-900">Finaliser votre abonnement</h2>
							</div>

							{selectedPlanData && (
								<div className="mb-6">
									<SubscriptionSummary selectedPlan={selectedPlanData} currentSubscription={currentSubscription} />
								</div>
							)}

							{isLoadingSetupIntent ? (
								<Card className="rounded-xl border-0 shadow-md">
									<CardContent className="p-8 text-center">
										<div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
										<p className="text-slate-600">Préparation du formulaire de paiement...</p>
									</CardContent>
								</Card>
							) : result?.client_secret ? (
								<Card className="rounded-xl border-0 shadow-md">
									<CardContent className="p-6">
										<StripeProvider clientSecret={result.client_secret}>
											<StripePaymentForm onSuccess={handlePaymentSuccess} onError={handlePaymentError} />
										</StripeProvider>
									</CardContent>
								</Card>
							) : (
								<Alert className="border-red-200 bg-red-50">
									<svg className="h-4 w-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
										/>
									</svg>
									<AlertDescription className="text-red-700">
										Impossible de charger le formulaire de paiement. Veuillez réessayer.
									</AlertDescription>
								</Alert>
							)}
						</div>
					)}

					{/* Messages de résultat */}
					{result && !showPaymentForm && (
						<Alert className={`mt-8 ${result.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}>
							<svg
								className={`h-4 w-4 ${result.success ? "text-green-500" : "text-red-500"}`}
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								{result.success ? (
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
								) : (
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								)}
							</svg>
							<AlertDescription className={result.success ? "text-green-700" : "text-red-700"}>{result.message}</AlertDescription>
						</Alert>
					)}
				</div>
			</div>
		</main>
	);
}
