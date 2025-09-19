"use client";

import { useState, useEffect } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { env } from "~/env";
import { api } from "~/trpc/react";
import AddPaymentMethodForm from "~/components/forms/add-payment-method-form";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Alert, AlertDescription } from "~/components/ui/alert";

const stripePromise = loadStripe(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

interface AddPaymentMethodProps {
	onSuccess?: () => void;
	onCancel?: () => void;
	className?: string;
}

export default function AddPaymentMethod({ onSuccess, onCancel, className }: AddPaymentMethodProps) {
	const [clientSecret, setClientSecret] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const createSetupIntent = api.subscription.createSetupIntent.useMutation({
		onSuccess: (data) => {
			setClientSecret(data.clientSecret);
			setError(null);
			setIsLoading(false);
		},
		onError: (error) => {
			setError(error.message);
			setIsLoading(false);
		},
	});

	const handleStartAddingPaymentMethod = () => {
		setIsLoading(true);
		setError(null);
		createSetupIntent.mutate();
	};

	const handleSuccess = () => {
		setClientSecret(null);
		setError(null);
		onSuccess?.();
	};

	const handleError = (errorMessage: string) => {
		setError(errorMessage);
	};

	const handleCancel = () => {
		setClientSecret(null);
		setError(null);
		onCancel?.();
	};

	if (!clientSecret) {
		return (
			<Card className={className}>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
						</svg>
						Ajouter un moyen de paiement
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<p className="text-sm text-slate-600">Ajoutez une nouvelle carte bancaire pour vos futurs paiements.</p>

					{error && (
						<Alert className="border-red-500 bg-red-50">
							<AlertDescription className="text-red-700">{error}</AlertDescription>
						</Alert>
					)}

					<div className="flex gap-3">
						{onCancel && (
							<Button type="button" variant="outline" className="flex-1" onClick={onCancel} disabled={isLoading}>
								Annuler
							</Button>
						)}
						<Button onClick={handleStartAddingPaymentMethod} disabled={isLoading} className="flex-1">
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
									Préparation...
								</>
							) : (
								<>
									<svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
									</svg>
									Ajouter une carte
								</>
							)}
						</Button>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Elements
			stripe={stripePromise}
			options={{
				clientSecret,
				appearance: {
					theme: "stripe",
					variables: {
						colorPrimary: "#3b82f6",
						colorBackground: "#ffffff",
						colorText: "#424770",
						colorDanger: "#df1b41",
						fontFamily: "system-ui, sans-serif",
						spacingUnit: "4px",
						borderRadius: "6px",
					},
				},
			}}
		>
			<AddPaymentMethodForm onSuccess={handleSuccess} onError={handleError} onCancel={handleCancel} className={className} />
		</Elements>
	);
}
