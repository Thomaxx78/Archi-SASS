"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { StripeProvider } from "~/components/providers/stripe-provider";
import StripePaymentForm from "~/components/ui/stripe-payment-form";

export default function Subscription() {
	const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
	const [showPaymentForm, setShowPaymentForm] = useState(false);
	const [result, setResult] = useState<{ success: boolean; message: string; client_secret?: string | null } | null>(null);
	const [isLoadingSetupIntent, setIsLoadingSetupIntent] = useState(false);

	// Récupérer les plans disponibles
	const { data: plans, isLoading: isLoadingPlans } = api.subscription.getPlans.useQuery();

	// Récupérer l'abonnement actuel
	const { data: currentSubscription } = api.subscription.getCurrentSubscription.useQuery();

	// Mutation pour créer un abonnement
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

	const handlePlanSelection = (priceId: string) => {
		setSelectedPlan(priceId);
		setResult(null);
	};

	const handleProceedToPayment = async () => {
		if (!selectedPlan) return;
		setIsLoadingSetupIntent(true);
		await createSubscription.mutateAsync({
			priceId: selectedPlan,
			customerId: "",
			paymentMethodId: "",
		});
		setShowPaymentForm(true);
	};

	const handlePaymentSuccess = async (paymentIntent: any) => {
		if (!selectedPlan) return;

		try {
			console.log("Payment succeeded:", paymentIntent);
		} catch (error) {}
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
	};

	if (isLoadingPlans) {
		return <div className="flex justify-center p-8">Chargement des plans...</div>;
	}

	return (
		<div className="container mx-auto max-w-4xl p-6">
			<div className="mb-8">
				<h1 className="mb-2 text-3xl font-bold">Test Subscription Stripe</h1>
				<p className="text-gray-600">Interface de test pour créer des abonnements</p>
			</div>

			{/* Affichage de l'abonnement actuel */}
			{currentSubscription && (
				<Alert className="mb-6">
					<AlertDescription>
						Abonnement actuel: <strong>{currentSubscription.plan?.name || "Plan inconnu"}</strong> - Status:{" "}
						<Badge variant={currentSubscription.status === "active" ? "default" : "secondary"}>{currentSubscription.status}</Badge>
					</AlertDescription>
				</Alert>
			)}

			{!showPaymentForm ? (
				<>
					{/* Sélection des plans */}
					<div className="mb-8 grid gap-6 md:grid-cols-2">
						{plans?.map((plan) => (
							<Card
								key={plan.id}
								className={`cursor-pointer transition-all ${
									selectedPlan === plan.priceId ? "border-blue-500 ring-2 ring-blue-500" : "hover:shadow-lg"
								}`}
								onClick={() => handlePlanSelection(plan.priceId)}
							>
								<CardHeader>
									<div className="flex items-start justify-between">
										<div>
											<CardTitle className="text-xl">{plan.name}</CardTitle>
											<CardDescription>Plan {plan.id}</CardDescription>
										</div>
										<div className="text-right">
											<div className="text-2xl font-bold">{plan.price === 0 ? "Gratuit" : `${plan.price / 100}€`}</div>
											<div className="text-sm text-gray-500">/{plan.interval}</div>
										</div>
									</div>
								</CardHeader>
								<CardContent>
									<ul className="space-y-2">
										{plan.features.map((feature, index) => (
											<li key={index} className="flex items-center text-sm">
												<div className="mr-2 h-2 w-2 rounded-full bg-green-500"></div>
												{feature}
											</li>
										))}
									</ul>
								</CardContent>
								<CardFooter>
									<div className="text-xs text-gray-500">Price ID: {plan.priceId}</div>
								</CardFooter>
							</Card>
						))}
					</div>

					{/* Bouton pour procéder au paiement */}
					<div className="mb-6 flex justify-center">
						<Button onClick={handleProceedToPayment} disabled={!selectedPlan} size="lg" className="px-8">
							Procéder au paiement
						</Button>
					</div>
				</>
			) : (
				<>
					{/* Formulaire de paiement */}
					<div className="mb-6">
						<Button variant="outline" onClick={handleBackToPlanSelection} className="mb-4">
							← Retour à la sélection du plan
						</Button>

						{selectedPlan && (
							<Alert className="mb-6">
								<AlertDescription>
									Plan sélectionné: <strong>{plans?.find((p) => p.priceId === selectedPlan)?.name}</strong> - Prix:{" "}
									<strong>
										{plans?.find((p) => p.priceId === selectedPlan)?.price === 0
											? "Gratuit"
											: `${(plans?.find((p) => p.priceId === selectedPlan)?.price || 0) / 100}€/mois`}
									</strong>
								</AlertDescription>
							</Alert>
						)}

						{isLoadingSetupIntent ? (
							<div className="flex justify-center p-8">Préparation du formulaire de paiement...</div>
						) : result?.client_secret ? (
							<StripeProvider clientSecret={result.client_secret}>
								<StripePaymentForm onSuccess={handlePaymentSuccess} onError={handlePaymentError} />
							</StripeProvider>
						) : (
							<Alert className="border-red-500 bg-red-50">
								<AlertDescription className="text-red-700">Impossible de charger le formulaire de paiement</AlertDescription>
							</Alert>
						)}
					</div>
				</>
			)}

			{/* Résultat */}
			{result && (
				<Alert className={result.success ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50"}>
					<AlertDescription className={result.success ? "text-green-700" : "text-red-700"}>{result.message}</AlertDescription>
				</Alert>
			)}

			{/* Informations de debug */}
			<Card className="mt-8">
				<CardHeader>
					<CardTitle className="text-lg">Debug Info</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-2 text-sm">
						<div>
							<strong>Plan sélectionné:</strong> {selectedPlan || "Aucun"}
						</div>
						<div>
							<strong>Formulaire de paiement:</strong> {showPaymentForm ? "Affiché" : "Masqué"}
						</div>
						<div>{/* <strong>Setup Intent:</strong> {setupIntent ? "Créé" : "Non créé"} */}</div>
						<div>
							<strong>Abonnement actuel:</strong> {currentSubscription ? "Oui" : "Non"}
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
