import { z } from 'zod';
import bcryptjs from 'bcryptjs';
import crypto from 'crypto';
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';
import { TRPCError } from '@trpc/server';
import { mailService } from '~/server/services/mail';
import { StripeService } from '~/server/services/stripe';
import { getWelcomeTemplate } from '~/server/templates/welcome';

const registerSchema = z.object({
	email: z.string().email(),
	password: z.string().min(6),
	name: z.string().min(1).optional(),
});

const loginSchema = z.object({
	email: z.string().email(),
	password: z.string(),
});

const verifyEmailSchema = z.object({
	token: z.string(),
});

const resendVerificationSchema = z.object({
	email: z.string().email(),
});

const forgotPasswordSchema = z.object({
	email: z.string().email(),
});

const resetPasswordSchema = z.object({
	token: z.string(),
	newPassword: z.string().min(6),
});

function getVerificationTemplate(data: { userName: string; verificationUrl: string; appName: string }) {
	return {
		subject: `Vérifiez votre email - ${data.appName}`,
		html: `
			<!DOCTYPE html>
			<html lang="fr">
			<head>
				<meta charset="UTF-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<title>Vérification d'email</title>
				<style>
					body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4; }
					.container { background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
					.header { text-align: center; border-bottom: 2px solid #3b82f6; padding-bottom: 20px; margin-bottom: 30px; }
					.header h1 { color: #3b82f6; margin: 0; font-size: 28px; }
					.button { display: inline-block; background: linear-gradient(to right, #2563eb, #7c3aed); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
					.footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 14px; }
					.security-note { background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 6px; padding: 15px; margin: 20px 0; color: #92400e; }
				</style>
			</head>
			<body>
				<div class="container">
					<div class="header">
						<h1>✉️ Vérifiez votre email</h1>
					</div>
					<div class="content">
						<p>Bonjour <strong>${data.userName}</strong>,</p>
						<p>Merci de vous être inscrit sur <strong>${data.appName}</strong> !</p>
						<p>Pour activer votre compte, cliquez sur le bouton ci-dessous :</p>
						<p style="text-align: center;">
							<a href="${data.verificationUrl}" class="button">✅ Vérifier mon email</a>
						</p>
						<div class="security-note">
							<p><strong>⚠️ Important :</strong> Ce lien expire dans 24 heures. Si vous n'avez pas créé ce compte, ignorez cet email.</p>
						</div>
						<p>Vous pouvez aussi copier-coller ce lien : <br><small>${data.verificationUrl}</small></p>
					</div>
					<div class="footer">
						<p>Cet email a été envoyé par ${data.appName}</p>
					</div>
				</div>
			</body>
			</html>
		`,
		text: `
			Vérifiez votre email - ${data.appName}

			Bonjour ${data.userName},

			Merci de vous être inscrit sur ${data.appName} !

			Pour activer votre compte, cliquez sur ce lien :
			${data.verificationUrl}

			Ce lien expire dans 24 heures. Si vous n'avez pas créé ce compte, ignorez cet email.
		`,
	};
}

function getPasswordResetTemplate(data: { userName: string; resetUrl: string; appName: string }) {
	return {
		subject: `Réinitialisation de votre mot de passe - ${data.appName}`,
		html: `
			<!DOCTYPE html>
			<html lang="fr">
			<head>
				<meta charset="UTF-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<title>Réinitialisation de mot de passe</title>
				<style>
					body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4; }
					.container { background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
					.header { text-align: center; border-bottom: 2px solid #3b82f6; padding-bottom: 20px; margin-bottom: 30px; }
					.header h1 { color: #3b82f6; margin: 0; font-size: 28px; }
					.button { display: inline-block; background: linear-gradient(to right, #2563eb, #7c3aed); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
					.footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 14px; }
					.security-note { background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 6px; padding: 15px; margin: 20px 0; color: #92400e; }
					.warning-note { background-color: #fef2f2; border: 1px solid #f87171; border-radius: 6px; padding: 15px; margin: 20px 0; color: #dc2626; }
				</style>
			</head>
			<body>
				<div class="container">
					<div class="header">
						<h1>🔑 Réinitialisation de mot de passe</h1>
					</div>
					<div class="content">
						<p>Bonjour <strong>${data.userName}</strong>,</p>
						<p>Vous avez demandé la réinitialisation de votre mot de passe sur <strong>${data.appName}</strong>.</p>
						<p>Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe :</p>
						<p style="text-align: center;">
							<a href="${data.resetUrl}" class="button">🔒 Réinitialiser mon mot de passe</a>
						</p>
						<div class="security-note">
							<p><strong>⚠️ Important :</strong> Ce lien expire dans 1 heure pour votre sécurité.</p>
						</div>
						<div class="warning-note">
							<p><strong>🚨 Si vous n'avez pas demandé cette réinitialisation :</strong><br>
							Ignorez cet email. Votre mot de passe actuel reste inchangé et sécurisé.</p>
						</div>
						<p>Vous pouvez aussi copier-coller ce lien : <br><small>${data.resetUrl}</small></p>
					</div>
					<div class="footer">
						<p>Cet email a été envoyé par ${data.appName}</p>
					</div>
				</div>
			</body>
			</html>
		`,
		text: `
			Réinitialisation de mot de passe - ${data.appName}

			Bonjour ${data.userName},

			Vous avez demandé la réinitialisation de votre mot de passe sur ${data.appName}.

			Cliquez sur ce lien pour créer un nouveau mot de passe :
			${data.resetUrl}

			Ce lien expire dans 1 heure pour votre sécurité.

			Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.
		`,
	};
}

export const authRouter = createTRPCRouter({
	register: publicProcedure.input(registerSchema).mutation(async ({ ctx, input }) => {
    const existingUser = await ctx.db.user.findUnique({
        where: { email: input.email },
    });

    if (existingUser) {
        throw new TRPCError({
            code: 'CONFLICT',
            message: 'Un compte avec cet email existe déjà',
        });
    }

    const hashedPassword = await bcryptjs.hash(input.password, 12);

    const emailToken = crypto.randomBytes(32).toString('hex');
    const emailTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const user = await ctx.db.user.create({
        data: {
            email: input.email,
            password: hashedPassword,
            name: input.name,
            emailToken,
            emailTokenExpiry,
            emailVerified: null,
        },
    });

		try {
			const customer = await StripeService.createCustomer({
				userId: user.id,
				email: input.email,
				name: input.name,
			});
			await ctx.db.user.update({
				where: { id: user.id },
				data: {
					stripeCustomerId: customer.id,
				},
			});
			console.log('🚀 ~ file: auth.ts:283 ~ register:publicProcedure.input.register.mutation ~ customer:', customer);
		} catch (error) {
			console.error('Failed to create Stripe customer:', error);
		}

		const verificationUrl = `${process.env.NEXTAUTH_URL}/verify-email?token=${emailToken}`;

    const verificationTemplate = getVerificationTemplate({
        userName: input.name || input.email,
        verificationUrl,
        appName: process.env.APP_NAME || 'EventMaster',
    });

    const welcomeTemplate = getWelcomeTemplate({
        userName: input.name || input.email,
        appName: process.env.APP_NAME || 'EventMaster',
        loginUrl: `${process.env.NEXTAUTH_URL}/login`,
    });

    await Promise.allSettled([
        mailService.sendMail({
            to: input.email,
            template: verificationTemplate,
        }),
        mailService.sendMail({
            to: input.email,
            template: welcomeTemplate,
        })
    ]);

    return {
        success: true,
        message: "Compte créé ! Vérifiez votre email pour l'activer.",
    };
}),

	login: publicProcedure.input(loginSchema).mutation(async ({ ctx, input }) => {
		const user = await ctx.db.user.findUnique({
			where: { email: input.email },
		});

		if (!user || !user.password) {
			throw new TRPCError({
				code: 'UNAUTHORIZED',
				message: 'Email ou mot de passe incorrect',
			});
		}

		const isValidPassword = await bcryptjs.compare(input.password, user.password);
		if (!isValidPassword) {
			throw new TRPCError({
				code: 'UNAUTHORIZED',
				message: 'Email ou mot de passe incorrect',
			});
		}

		if (!user.emailVerified) {
			throw new TRPCError({
				code: 'FORBIDDEN',
				message: 'Veuillez vérifier votre email avant de vous connecter',
			});
		}

		return {
			success: true,
			user: {
				id: user.id,
				email: user.email,
				name: user.name,
				emailVerified: user.emailVerified,
			},
		};
	}),

	verifyEmail: publicProcedure.input(verifyEmailSchema).mutation(async ({ ctx, input }) => {
    const user = await ctx.db.user.findUnique({
        where: { emailToken: input.token },
    });

    if (!user) {
        throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Token invalide',
        });
    }

    if (!user.emailTokenExpiry || user.emailTokenExpiry < new Date()) {
        throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Token expiré',
        });
    }

    await ctx.db.user.update({
        where: { id: user.id },
        data: {
            emailVerified: new Date(),
            emailToken: null,
            emailTokenExpiry: null,
        },
    });

    const welcomeTemplate = getWelcomeTemplate({
        userName: user.name || user.email!,
        appName: process.env.APP_NAME || 'EventMaster',
        loginUrl: `${process.env.NEXTAUTH_URL}/login`,
    });

    try {
        await mailService.sendMail({
            to: user.email!,
            template: welcomeTemplate,
        });
    } catch (error) {
        console.error('Failed to send welcome email:', error);
    }

    return {
        success: true,
        message: 'Email vérifié avec succès !',
    };
}),


	resendVerification: publicProcedure.input(resendVerificationSchema).mutation(async ({ ctx, input }) => {
		const user = await ctx.db.user.findUnique({
			where: { email: input.email },
		});

		if (!user) {
			throw new TRPCError({
				code: 'NOT_FOUND',
				message: 'Utilisateur non trouvé',
			});
		}

		if (user.emailVerified) {
			throw new TRPCError({
				code: 'BAD_REQUEST',
				message: 'Email déjà vérifié',
			});
		}

		const emailToken = crypto.randomBytes(32).toString('hex');
		const emailTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

		await ctx.db.user.update({
			where: { id: user.id },
			data: {
				emailToken,
				emailTokenExpiry,
			},
		});

		const verificationUrl = `${process.env.NEXTAUTH_URL}/verify-email?token=${emailToken}`;
		const template = getVerificationTemplate({
			userName: user.name || user.email!,
			verificationUrl,
			appName: process.env.APP_NAME || 'EventMaster',
		});

		await mailService.sendMail({
			to: input.email,
			template,
		});

		return {
			success: true,
			message: 'Email de vérification renvoyé !',
		};
	}),

	forgotPassword: publicProcedure.input(forgotPasswordSchema).mutation(async ({ ctx, input }) => {
		const user = await ctx.db.user.findUnique({
			where: { email: input.email },
		});

		if (!user || !user.password) {
			return {
				success: true,
				message: 'Si cette adresse email existe, vous recevrez un lien de réinitialisation.',
			};
		}

		const resetToken = crypto.randomBytes(32).toString('hex');
		const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);

		await ctx.db.user.update({
			where: { id: user.id },
			data: {
				resetPasswordToken: resetToken,
				resetPasswordTokenExpiry: resetTokenExpiry,
			},
		});

		const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;
		const template = getPasswordResetTemplate({
			userName: user.name || user.email!,
			resetUrl,
			appName: process.env.APP_NAME || 'EventMaster',
		});

		try {
			await mailService.sendMail({
				to: input.email,
				template,
			});
		} catch (error) {
			console.error('Failed to send password reset email:', error);
		}

		return {
			success: true,
			message: 'Si cette adresse email existe, vous recevrez un lien de réinitialisation.',
		};
	}),

	resetPassword: publicProcedure.input(resetPasswordSchema).mutation(async ({ ctx, input }) => {
		const user = await ctx.db.user.findUnique({
			where: { resetPasswordToken: input.token },
		});

		if (!user) {
			throw new TRPCError({
				code: 'BAD_REQUEST',
				message: 'Token invalide',
			});
		}

		if (!user.resetPasswordTokenExpiry || user.resetPasswordTokenExpiry < new Date()) {
			throw new TRPCError({
				code: 'BAD_REQUEST',
				message: 'Token expiré',
			});
		}

		const hashedPassword = await bcryptjs.hash(input.newPassword, 12);

		await ctx.db.user.update({
			where: { id: user.id },
			data: {
				password: hashedPassword,
				resetPasswordToken: null,
				resetPasswordTokenExpiry: null,
			},
		});

		return {
			success: true,
			message: 'Votre mot de passe a été mis à jour avec succès !',
		};
	}),
});
