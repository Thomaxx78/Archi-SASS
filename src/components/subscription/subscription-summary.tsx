"use client";

import { Alert, AlertDescription } from "~/components/ui/alert";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

interface Plan {
	id: string;
	name: string;
	price: number;
	interval: string;
	priceId?: string;
	features: string[];
	isStripe: boolean;
}

interface SubscriptionSummaryProps {
	selectedPlan: Plan;
	currentSubscription?: any;
}

export function SubscriptionSummary({ selectedPlan, currentSubscription }: SubscriptionSummaryProps) {
	const isUpgrade = currentSubscription && currentSubscription.plan?.price < selectedPlan.price;
	const isDowngrade = currentSubscription && currentSubscription.plan?.price > selectedPlan.price;
	const isSamePlan = currentSubscription && currentSubscription.plan?.priceId === selectedPlan.priceId;

	return (
		<Card className="rounded-xl border-0 shadow-md">
			<CardHeader className="border-b border-slate-100">
				<CardTitle className="flex items-center gap-2 text-xl text-slate-900">
					<svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
					Résumé de votre sélection
				</CardTitle>
			</CardHeader>

			<CardContent className="p-6">
				<div className="space-y-6">
					{/* Plan sélectionné */}
					<div className="rounded-lg border border-slate-200 bg-gradient-to-r from-blue-50 to-purple-50 p-4">
						<div className="flex items-center justify-between">
							<div>
								<h3 className="text-lg font-semibold text-slate-900">{selectedPlan.name}</h3>
								<p className="text-sm text-slate-600">Plan {selectedPlan.id}</p>
							</div>
							<div className="text-right">
								<div className="text-2xl font-bold text-slate-900">
									{selectedPlan.price === 0 ? "Gratuit" : `${selectedPlan.price / 100}€`}
								</div>
								<div className="text-sm font-medium text-slate-500">{selectedPlan.price > 0 && `/${selectedPlan.interval}`}</div>
							</div>
						</div>
					</div>

					{/* Message d'information selon la situation */}
					{isSamePlan ? (
						<Alert className="border-amber-200 bg-amber-50">
							<svg className="h-4 w-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.858-.833-2.5 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
								/>
							</svg>
							<AlertDescription className="text-amber-700">
								<strong>Plan identique :</strong> Vous avez sélectionné votre plan actuel. Aucun changement ne sera effectué.
							</AlertDescription>
						</Alert>
					) : isUpgrade ? (
						<Alert className="border-green-200 bg-green-50">
							<svg className="h-4 w-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
							</svg>
							<AlertDescription className="text-green-700">
								<strong>Upgrade :</strong> Vous passez au plan supérieur. Les nouvelles fonctionnalités seront disponibles
								immédiatement.
							</AlertDescription>
						</Alert>
					) : isDowngrade ? (
						<Alert className="border-blue-200 bg-blue-50">
							<svg className="h-4 w-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" />
							</svg>
							<AlertDescription className="text-blue-700">
								<strong>Downgrade :</strong> Vous passez à un plan inférieur. Le changement prendra effet à la fin de votre période de
								facturation actuelle.
							</AlertDescription>
						</Alert>
					) : (
						<Alert className="border-blue-200 bg-blue-50">
							<svg className="h-4 w-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
							</svg>
							<AlertDescription className="text-blue-700">
								<strong>Nouvel abonnement :</strong> Vous allez souscrire à votre premier plan. L'accès aux fonctionnalités sera
								immédiat après le paiement.
							</AlertDescription>
						</Alert>
					)}

					{/* Fonctionnalités incluses */}
					<div className="space-y-3">
						<h4 className="font-medium text-slate-700">Fonctionnalités incluses :</h4>
						<ul className="grid gap-2 md:grid-cols-1">
							{selectedPlan.features.map((feature, index) => (
								<li key={index} className="flex items-center text-sm text-slate-600">
									<svg className="mr-3 h-4 w-4 flex-shrink-0 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
									</svg>
									{feature}
								</li>
							))}
						</ul>
					</div>

					{/* Informations de facturation */}
					{selectedPlan.price > 0 && (
						<div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
							<h4 className="mb-3 font-medium text-slate-700">Détails de facturation :</h4>
							<div className="space-y-2 text-sm">
								<div className="flex justify-between">
									<span className="text-slate-600">Prix mensuel :</span>
									<span className="font-medium text-slate-900">{selectedPlan.price / 100}€</span>
								</div>
								<div className="flex justify-between">
									<span className="text-slate-600">Fréquence :</span>
									<span className="font-medium text-slate-900">Chaque {selectedPlan.interval}</span>
								</div>
								<div className="border-t border-slate-200 pt-2">
									<div className="flex justify-between">
										<span className="font-medium text-slate-700">Total aujourd'hui :</span>
										<span className="font-bold text-slate-900">{selectedPlan.price / 100}€</span>
									</div>
								</div>
							</div>
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
