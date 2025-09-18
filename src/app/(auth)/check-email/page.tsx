"use client";

import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";

export default function CheckEmailPage() {
	return (
		<main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50 p-4">
			<Card className="w-full max-w-md text-center">
				<CardContent className="pt-8">
					<div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
						<svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
							/>
						</svg>
					</div>
					<h1 className="mb-2 text-2xl font-bold text-slate-900">Vérifiez votre email</h1>
					<p className="mb-6 text-slate-600">Un lien de vérification a été envoyé à votre adresse email.</p>
					<Link href="/login">
						<Button variant="outline">Retour à la connexion</Button>
					</Link>
				</CardContent>
			</Card>
		</main>
	);
}
