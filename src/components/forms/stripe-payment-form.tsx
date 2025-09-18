"use client";

import { useState } from "react";
import { useStripe, useElements, PaymentElement, AddressElement } from "@stripe/react-stripe-js";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Alert, AlertDescription } from "~/components/ui/alert";

interface StripePaymentFormProps {
	onSuccess?: (paymentIntent: any) => void;
	onError?: (error: string) => void;
	className?: string;
}

export default function StripePaymentForm({ onSuccess, onError, className }: StripePaymentFormProps) {
	const stripe = useStripe();
	const elements = useElements();

	const [isProcessing, setIsProcessing] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();

		if (!stripe || !elements) {
			return;
		}

		setIsProcessing(true);
		setErrorMessage(null);

		try {
			const { error, paymentIntent } = await stripe.confirmPayment({
				elements,
				confirmParams: {
					return_url: `${window.location.origin}/profile?subscription_success=true`,
				},
				redirect: "if_required",
			});

			if (error) {
				setErrorMessage(error.message || "Une erreur s'est produite");
				onError?.(error.message || "Une erreur s'est produite");
			} else if (paymentIntent) {
				window.location.href = `/profile?subscription_success=true`;
				onSuccess?.(paymentIntent);
			}
		} catch (err) {
			const message = err instanceof Error ? err.message : "Erreur inconnue";
			setErrorMessage(message);
			onError?.(message);
		} finally {
			setIsProcessing(false);
		}
	};

	return (
		<Card className={className}>
			<CardHeader>
				<CardTitle>Informations de paiement</CardTitle>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className="space-y-6">
					<div>
						<PaymentElement />
					</div>

					<div>
						<label className="mb-2 block text-sm font-medium">Adresse de facturation</label>
						<div className="rounded-md border p-3">
							<AddressElement
								options={{
									mode: "billing",
									allowedCountries: ["FR", "BE", "CH", "CA", "US"],
								}}
							/>
						</div>
					</div>

					{errorMessage && (
						<Alert className="border-red-500 bg-red-50">
							<AlertDescription className="text-red-700">{errorMessage}</AlertDescription>
						</Alert>
					)}

					<Button type="submit" disabled={!stripe || !elements || isProcessing} className="w-full" size="lg">
						{isProcessing ? "Traitement en cours..." : "Confirmer le paiement"}
					</Button>
				</form>
			</CardContent>
		</Card>
	);
}
