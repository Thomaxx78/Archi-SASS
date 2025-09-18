"use client";

import { useState } from "react";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Alert, AlertDescription } from "~/components/ui/alert";

interface AddPaymentMethodFormProps {
	onSuccess?: () => void;
	onError?: (error: string) => void;
	onCancel?: () => void;
	className?: string;
}

export default function AddPaymentMethodForm({ onSuccess, onError, onCancel, className }: AddPaymentMethodFormProps) {
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
			const { error, setupIntent } = await stripe.confirmSetup({
				elements,
				confirmParams: {
					return_url: `${window.location.origin}/profile?payment_method_added=true`,
				},
				redirect: "if_required",
			});

			if (error) {
				setErrorMessage(error.message || "Une erreur s'est produite");
				onError?.(error.message || "Une erreur s'est produite");
			} else if (setupIntent && setupIntent.status === "succeeded") {
				onSuccess?.();
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
				<CardTitle className="flex items-center gap-2">
					<svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
					</svg>
					Ajouter un moyen de paiement
				</CardTitle>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className="space-y-6">
					<div>
						<label className="mb-2 block text-sm font-medium">Informations de la carte</label>
						<div className="rounded-md border p-3">
							<PaymentElement
								options={{
									layout: "tabs",
								}}
							/>
						</div>
						<p className="mt-2 text-xs text-slate-500">Cette carte sera enregistrée pour vos futurs paiements</p>
					</div>

					{errorMessage && (
						<Alert className="border-red-500 bg-red-50">
							<AlertDescription className="text-red-700">{errorMessage}</AlertDescription>
						</Alert>
					)}

					<div className="flex gap-3 pt-4">
						{onCancel && (
							<Button type="button" variant="outline" className="flex-1" onClick={onCancel} disabled={isProcessing}>
								<svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
								</svg>
								Annuler
							</Button>
						)}
						<Button type="submit" disabled={!stripe || !elements || isProcessing} className="flex-1">
							{isProcessing ? (
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
									Enregistrer la carte
								</>
							)}
						</Button>
					</div>
				</form>
			</CardContent>
		</Card>
	);
}
