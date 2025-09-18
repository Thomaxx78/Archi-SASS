"use client";

import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";

interface Plan {
	id: string;
	name: string;
	price: number;
	interval: string;
	priceId: string;
	features: string[];
}

interface PlanCardProps {
	plan: Plan;
	isSelected: boolean;
	onSelect: (priceId: string) => void;
	isCurrentPlan?: boolean;
}

export function PlanCard({ plan, isSelected, onSelect, isCurrentPlan = false }: PlanCardProps) {
	return (
		<Card
			className={`relative cursor-pointer transition-all duration-200 ${
				isSelected ? "border-blue-500 shadow-lg ring-2 ring-blue-500" : "hover:border-blue-300 hover:shadow-lg"
			} ${isCurrentPlan ? "bg-gradient-to-br from-blue-50 to-purple-50" : ""}`}
			onClick={() => onSelect(plan.priceId)}
		>
			{isCurrentPlan && (
				<div className="absolute -top-3 left-1/2 -translate-x-1/2 transform">
					<Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">Plan actuel</Badge>
				</div>
			)}

			<CardHeader className="pb-4">
				<div className="flex items-start justify-between">
					<div>
						<CardTitle className="text-xl font-semibold text-slate-900">{plan.name}</CardTitle>
						<CardDescription className="text-slate-600">Plan {plan.id}</CardDescription>
					</div>
					<div className="text-right">
						<div className="text-3xl font-bold text-slate-900">{plan.price === 0 ? "Gratuit" : `${plan.price / 100}€`}</div>
						<div className="text-sm font-medium text-slate-500">{plan.price > 0 && `/${plan.interval}`}</div>
					</div>
				</div>
			</CardHeader>

			<CardContent className="pb-6">
				<div className="space-y-3">
					<h4 className="font-medium text-slate-700">Fonctionnalités incluses :</h4>
					<ul className="space-y-2">
						{plan.features.map((feature, index) => (
							<li key={index} className="flex items-center text-sm text-slate-600">
								<svg className="mr-3 h-4 w-4 flex-shrink-0 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
								</svg>
								{feature}
							</li>
						))}
					</ul>
				</div>
			</CardContent>

			<CardFooter className="pt-0">
				<div className="w-full space-y-3">
					{isSelected && (
						<div className="flex items-center justify-center gap-2 rounded-lg bg-blue-50 p-2 text-sm font-medium text-blue-700">
							<svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
							</svg>
							Plan sélectionné
						</div>
					)}

					<div className="text-center text-xs text-slate-400">ID: {plan.priceId}</div>
				</div>
			</CardFooter>
		</Card>
	);
}
