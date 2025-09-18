import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import type Stripe from 'stripe';
import { env } from '~/env';
import { stripe } from '~/server/services/stripe';
import { db } from '~/server/db';

export async function POST(req: NextRequest) {
	const body = await req.text();
	const headersList = await headers();
	const signature = headersList.get('stripe-signature');

	if (!signature) {
		console.error('❌ No Stripe signature found');
		return NextResponse.json({ error: 'No signature' }, { status: 400 });
	}

	if (!env.STRIPE_WEBHOOK_SECRET) {
		console.error('❌ STRIPE_WEBHOOK_SECRET not configured');
		return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
	}

	let event: Stripe.Event;

	try {
		event = stripe.webhooks.constructEvent(body, signature, env.STRIPE_WEBHOOK_SECRET);
	} catch (err) {
		console.error('❌ Webhook signature verification failed:', err);
		return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
	}

	console.log(`🔔 Webhook received: ${event.type}`);

	try {
		switch (event.type) {
			case 'customer.subscription.created':
			case 'customer.subscription.updated':
				await handleSubscriptionChange(event.data.object);
				break;

			case 'customer.subscription.deleted':
				await handleSubscriptionDeleted(event.data.object);
				break;

			case 'invoice.payment_succeeded':
				await handleInvoicePaymentSucceeded(event.data.object);
				break;

			case 'invoice.payment_failed':
				await handleInvoicePaymentFailed(event.data.object);
				break;

			case 'payment_intent.succeeded':
				console.log('✅ Payment succeeded:', event.data.object.id);
				break;

			default:
				console.log(`🤷 Unhandled event type: ${event.type}`);
		}

		return NextResponse.json({ received: true });
	} catch (error) {
		console.error('❌ Webhook handler error:', error);
		return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
	}
}

async function handleSubscriptionChange(subscription: any) {
	try {
		console.log(`🔄 Handling subscription change: ${subscription.id} - Status: ${subscription.status}`);

		const existingSubscription = await db.subscription.findUnique({
			where: { stripeSubscriptionId: subscription.id },
		});

		if (!existingSubscription) {
			console.log(`⚠️ Subscription ${subscription.id} not found in database`);
			return;
		}

		await db.subscription.update({
			where: { stripeSubscriptionId: subscription.id },
			data: {
				status: subscription.status,
				currentPeriodStart: subscription.current_period_start ? new Date(subscription.current_period_start * 1000) : null,
				currentPeriodEnd: subscription.current_period_end ? new Date(subscription.current_period_end * 1000) : null,
				cancelAt: subscription.cancel_at ? new Date(subscription.cancel_at * 1000) : null,
				canceledAt: subscription.canceled_at ? new Date(subscription.canceled_at * 1000) : null,
				trialStart: subscription.trial_start ? new Date(subscription.trial_start * 1000) : null,
				trialEnd: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null,
			},
		});

		console.log(`✅ Subscription ${subscription.id} updated successfully`);
	} catch (error) {
		console.error('❌ Error handling subscription change:', error);
		throw error;
	}
}

async function handleSubscriptionDeleted(subscription: any) {
	try {
		console.log(`🗑️ Handling subscription deletion: ${subscription.id}`);

		await db.subscription.update({
			where: { stripeSubscriptionId: subscription.id },
			data: {
				status: 'canceled',
				canceledAt: new Date(),
			},
		});

		console.log(`✅ Subscription ${subscription.id} marked as canceled`);
	} catch (error) {
		console.error('❌ Error handling subscription deletion:', error);
		throw error;
	}
}

async function handleInvoicePaymentSucceeded(invoice: any) {
	try {
		console.log(`💰 Handling successful payment for invoice: ${invoice.id}`);

		if (!invoice.subscription) {
			console.log('⚠️ Invoice has no subscription, skipping');
			return;
		}

		const subscription = await db.subscription.findUnique({
			where: { stripeSubscriptionId: invoice.subscription },
		});

		if (subscription) {
			await db.subscription.update({
				where: { stripeSubscriptionId: invoice.subscription },
				data: {
					status: 'active',
				},
			});

			await db.invoice.upsert({
				where: { stripeInvoiceId: invoice.id },
				create: {
					subscriptionId: subscription.id,
					stripeInvoiceId: invoice.id,
					stripePaymentIntentId: invoice.payment_intent || null,
					status: invoice.status || 'paid',
					amountPaid: invoice.amount_paid || 0,
					amountDue: invoice.amount_due || 0,
					currency: invoice.currency || 'eur',
					periodStart: new Date(invoice.period_start * 1000),
					periodEnd: new Date(invoice.period_end * 1000),
					paidAt: invoice.status_transitions?.paid_at ? new Date(invoice.status_transitions.paid_at * 1000) : new Date(),
				},
				update: {
					status: invoice.status || 'paid',
					amountPaid: invoice.amount_paid || 0,
					paidAt: invoice.status_transitions?.paid_at ? new Date(invoice.status_transitions.paid_at * 1000) : new Date(),
				},
			});

			console.log(`✅ Invoice ${invoice.id} processed successfully`);
		}
	} catch (error) {
		console.error('❌ Error handling invoice payment succeeded:', error);
		throw error;
	}
}

async function handleInvoicePaymentFailed(invoice: any) {
	try {
		console.log(`❌ Handling failed payment for invoice: ${invoice.id}`);

		if (!invoice.subscription) {
			console.log('⚠️ Invoice has no subscription, skipping');
			return;
		}

		await db.subscription.update({
			where: { stripeSubscriptionId: invoice.subscription },
			data: {
				status: 'past_due',
			},
		});

		console.log(`⚠️ Subscription marked as past_due for failed payment`);
	} catch (error) {
		console.error('❌ Error handling invoice payment failed:', error);
		throw error;
	}
}
