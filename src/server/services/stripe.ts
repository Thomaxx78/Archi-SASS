import Stripe from 'stripe';
import { env } from '~/env';

if (!env.STRIPE_SECRET_KEY) {
	throw new Error('STRIPE_SECRET_KEY is required');
}

export const stripe = new Stripe(env.STRIPE_SECRET_KEY);

export interface CreateCustomerParams {
	userId: string;
	email: string;
	name?: string;
}

export interface CreateSubscriptionParams {
	userId?: string;
	priceId: string;
	paymentMethodId?: string;
	customerId: string;
}

export interface PlanInfo {
	id: string;
	name: string;
	price: number;
	interval: 'month';
	features: string[];
	productId: string;
	priceId: string;
}

export const PLANS: Record<string, PlanInfo> = {
	starter: {
		id: 'starter',
		name: 'Starter',
		price: 0,
		interval: 'month',
		features: ["Jusqu'à 3 événements/mois", '50 invités maximum', 'Templates de base', 'Support par email'],
		productId: 'prod_T4obzE1m8lgYQH',
		priceId: 'price_1S8ey12N0jQcs8P4CZCbF8fU',
	},
	pro: {
		id: 'pro',
		name: 'Pro',
		price: 2900,
		interval: 'month',
		features: ['Événements illimités', '1000 invités maximum', 'Templates premium + IA', 'Analytiques avancées', 'Support prioritaire'],
		productId: 'prod_T4nqgubJINojBH',
		priceId: 'price_1S8eEy2N0jQcs8P4EBYLWRTz',
	},
};

export class StripeService {
	/**
	 * Create a new Stripe customer
	 * @param params - CreateCustomerParams (userId, email, name)
	 * @returns Stripe.Customer
	 * @throws Error
	 */
	static async createCustomer(params: CreateCustomerParams) {
		try {
			const { userId, email, name } = params;
			const customer = await stripe.customers.create({
				email,
				name,
				metadata: {
					userId,
				},
			});
			return customer;
		} catch (error) {
			console.error('❌ [ERROR - STRIPE - CREATE CUSTOMER] ', error);
			throw error;
		}
	}

	/**
	 * Create a Setup Intent for a customer to save their payment method
	 * @param customerId - The ID of the Stripe customer
	 * @returns An object containing the client secret and setup intent ID
	 * @throws Error
	 */
	static async createSetupIntent(customerId: string) {
		try {
			const setupIntent = await stripe.setupIntents.create({
				customer: customerId,
				payment_method_types: ['card'],
				usage: 'off_session', // Pour les paiements récurrents
				metadata: {
					type: 'subscription_setup',
				},
			});

			return {
				clientSecret: setupIntent.client_secret,
				setupIntentId: setupIntent.id,
			};
		} catch (error) {
			console.error('❌ [ERROR - STRIPE - CREATE SETUP INTENT] ', error);
			throw error;
		}
	}

	static async createSubscription(params: CreateSubscriptionParams) {
		try {
			const { priceId, customerId } = params;
			const subscription = await stripe.subscriptions.create({
				customer: customerId,
				items: [
					{
						price: priceId,
					},
				],
				payment_behavior: 'default_incomplete',
				payment_settings: { save_default_payment_method: 'on_subscription' },
				billing_mode: { type: 'flexible' },
				expand: ['latest_invoice.confirmation_secret'],
			});
			console.log('🚀 ~ file: stripe.ts:136 ~ StripeService ~ createSubscription ~ subscription:', subscription);
			return {
				subscriptionId: subscription.id,
				clientSecret: (subscription.latest_invoice as any)?.confirmation_secret?.client_secret,
				status: subscription.status,
			};
		} catch (error) {
			console.error('❌ [ERROR - STRIPE - CREATE SUBSCRIPTION] ', error);
			throw error;
		}
	}

	/**
	 * Get payment methods for a customer
	 * @param customerId - The ID of the Stripe customer
	 * @returns List of payment methods
	 * @throws Error
	 */
	static async getPaymentMethods(customerId: string) {
		try {
			const paymentMethods = await stripe.paymentMethods.list({
				customer: customerId,
				type: 'card',
			});

			return paymentMethods.data.map((pm) => ({
				id: pm.id,
				type: pm.type,
				card: pm.card
					? {
							brand: pm.card.brand,
							last4: pm.card.last4,
							expMonth: pm.card.exp_month,
							expYear: pm.card.exp_year,
							funding: pm.card.funding,
						}
					: null,
				created: pm.created,
			}));
		} catch (error) {
			console.error('❌ [ERROR - STRIPE - GET PAYMENT METHODS] ', error);
			throw error;
		}
	}

	/**
	 * Detach a payment method from a customer
	 * @param paymentMethodId - The ID of the payment method to detach
	 * @returns The detached payment method
	 * @throws Error
	 */
	static async detachPaymentMethod(paymentMethodId: string) {
		try {
			const paymentMethod = await stripe.paymentMethods.detach(paymentMethodId);
			return paymentMethod;
		} catch (error) {
			console.error('❌ [ERROR - STRIPE - DETACH PAYMENT METHOD] ', error);
			throw error;
		}
	}
}
