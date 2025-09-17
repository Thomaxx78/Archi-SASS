"use client";

import Link from "next/link";
import { Button } from "~/components/ui/button";

interface BackButtonProps {
	href: string;
	label: string;
}

export function BackButton({ href, label }: BackButtonProps) {
	return (
		<div className="container mx-auto px-6 py-4 border-b border-slate-100">
			<Button variant="ghost" size="sm" asChild>
				<Link href={href}>
					<svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
					</svg>
					{label}
				</Link>
			</Button>
		</div>
	);
}