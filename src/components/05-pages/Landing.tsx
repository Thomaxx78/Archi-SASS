import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { Separator } from "~/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

export default function Landing() {
	return (
		<main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50">
			{/* Navigation */}
			<nav className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/80 backdrop-blur-lg">
				<div className="container mx-auto px-6 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-2">
							<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600">
								<span className="text-sm font-bold text-white">E</span>
							</div>
						</div>
						<div className="flex items-center space-x-4">
							<Button variant="ghost" asChild>
								<Link href="#features">Fonctionnalités</Link>
							</Button>
							<Button variant="ghost" asChild>
								<Link href="#pricing">Tarifs</Link>
							</Button>
							<Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" asChild>
								<Link href="/login">
									Commencer
								</Link>
							</Button>
						</div>
					</div>
				</div>
			</nav>

			{/* Hero Section */}
			<section className="relative overflow-hidden py-20 lg:py-32">
				<div className="container mx-auto px-6">
					<div className="mx-auto max-w-4xl text-center">
						<Badge variant="secondary" className="mb-6 border-blue-200 bg-blue-50 text-blue-700">
							✨ Nouveau : IA intégrée pour vos événements
						</Badge>
						<h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-6xl lg:text-7xl">
							Créez des événements
							<span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
								{" "}extraordinaires
							</span>
						</h1>
						<p className="mx-auto mb-10 max-w-2xl text-xl leading-relaxed text-slate-600">
							La plateforme tout-en-un pour organiser, gérer et analyser vos événements avec une expérience utilisateur exceptionnelle et des outils professionnels.
						</p>
						<div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
							<Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-4 text-lg shadow-lg shadow-blue-500/25" asChild>
								<Link href="/login">
									Démarrer gratuitement
								</Link>
							</Button>
						</div>
						<div className="mt-12 flex items-center justify-center gap-8 text-sm text-slate-600">
							<div className="flex items-center gap-2">
								<div className="h-2 w-2 rounded-full bg-green-500"></div>
								Gratuit pendant 30 jours
							</div>
							<div className="flex items-center gap-2">
								<div className="h-2 w-2 rounded-full bg-green-500"></div>
								Sans engagement
							</div>
							<div className="flex items-center gap-2">
								<div className="h-2 w-2 rounded-full bg-green-500"></div>
								Support 24/7
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section id="features" className="py-24 bg-white">
				<div className="container mx-auto px-6">
					<div className="mx-auto max-w-3xl text-center mb-16">
						<Badge variant="outline" className="mb-4 border-blue-200 text-blue-700">
							Fonctionnalités
						</Badge>
						<h2 className="mb-6 text-4xl font-bold text-slate-900 lg:text-5xl">
							Tout ce dont vous avez besoin pour des événements
							<span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> parfaits</span>
						</h2>
						<p className="text-xl text-slate-600">
							Des outils professionnels pour créer, gérer et analyser vos événements avec une simplicité déconcertante.
						</p>
					</div>

					<Tabs defaultValue="create" className="w-full">
						<TabsList className="grid w-full grid-cols-3 mb-12 bg-slate-100">
							<TabsTrigger value="create" className="text-center">Créer</TabsTrigger>
							<TabsTrigger value="manage" className="text-center">Gérer</TabsTrigger>
							<TabsTrigger value="analyze" className="text-center">Analyser</TabsTrigger>
						</TabsList>

						<TabsContent value="create" className="space-y-8">
							<div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
								<Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-md hover:shadow-blue-500/10">
									<CardHeader>
										<div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg">
											<svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
											</svg>
										</div>
										<CardTitle className="text-xl group-hover:text-blue-600 transition-colors">Création intuitive</CardTitle>
									</CardHeader>
									<CardContent>
										<p className="text-slate-600 leading-relaxed">
											Interface moderne et intuitive pour créer vos événements en quelques clics. Templates prêts à l'emploi et personnalisation avancée.
										</p>
									</CardContent>
								</Card>

								<Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-md hover:shadow-purple-500/10">
									<CardHeader>
										<div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg">
											<svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
											</svg>
										</div>
										<CardTitle className="text-xl group-hover:text-purple-600 transition-colors">Templates personnalisables</CardTitle>
									</CardHeader>
									<CardContent>
										<p className="text-slate-600 leading-relaxed">
											Bibliothèque de templates professionnels pour tous types d'événements. Personnalisation complète de votre branding.
										</p>
									</CardContent>
								</Card>

								<Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-md hover:shadow-emerald-500/10">
									<CardHeader>
										<div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg">
											<svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
											</svg>
										</div>
										<CardTitle className="text-xl group-hover:text-emerald-600 transition-colors">IA Assistant</CardTitle>
									</CardHeader>
									<CardContent>
										<p className="text-slate-600 leading-relaxed">
											Assistant IA pour vous aider à planifier et optimiser vos événements. Suggestions automatiques et recommandations personnalisées.
										</p>
									</CardContent>
								</Card>
							</div>
						</TabsContent>

						<TabsContent value="manage" className="space-y-8">
							<div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
								<Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-md hover:shadow-orange-500/10">
									<CardHeader>
										<div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg">
											<svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
											</svg>
										</div>
										<CardTitle className="text-xl group-hover:text-orange-600 transition-colors">Gestion des participants</CardTitle>
									</CardHeader>
									<CardContent>
										<p className="text-slate-600 leading-relaxed">
											Invitations automatiques, suivi des confirmations en temps réel et gestion avancée des listes d'invités.
										</p>
									</CardContent>
								</Card>

								<Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-md hover:shadow-pink-500/10">
									<CardHeader>
										<div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-pink-600 text-white shadow-lg">
											<svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5v-4a4 4 0 011-7.54V3h2v2.46a4 4 0 011 7.54V17z" />
											</svg>
										</div>
										<CardTitle className="text-xl group-hover:text-pink-600 transition-colors">Notifications intelligentes</CardTitle>
									</CardHeader>
									<CardContent>
										<p className="text-slate-600 leading-relaxed">
											Système de notifications multicanal automatique. Email, SMS et notifications push pour tenir vos invités informés.
										</p>
									</CardContent>
								</Card>

								<Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-md hover:shadow-cyan-500/10">
									<CardHeader>
										<div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 text-white shadow-lg">
											<svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
											</svg>
										</div>
										<CardTitle className="text-xl group-hover:text-cyan-600 transition-colors">Sondages avancés</CardTitle>
									</CardHeader>
									<CardContent>
										<p className="text-slate-600 leading-relaxed">
											Créez des sondages interactifs pour recueillir les préférences de vos invités et optimiser l'organisation.
										</p>
									</CardContent>
								</Card>
							</div>
						</TabsContent>

						<TabsContent value="analyze" className="space-y-8">
							<div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
								<Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-md hover:shadow-indigo-500/10">
									<CardHeader>
										<div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-lg">
											<svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
											</svg>
										</div>
										<CardTitle className="text-xl group-hover:text-indigo-600 transition-colors">Analytiques poussées</CardTitle>
									</CardHeader>
									<CardContent>
										<p className="text-slate-600 leading-relaxed">
											Tableaux de bord complets avec métriques détaillées, taux de participation et insights comportementaux.
										</p>
									</CardContent>
								</Card>

								<Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-md hover:shadow-violet-500/10">
									<CardHeader>
										<div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 text-white shadow-lg">
											<svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10v11M20 10v11" />
											</svg>
										</div>
										<CardTitle className="text-xl group-hover:text-violet-600 transition-colors">Rapports automatisés</CardTitle>
									</CardHeader>
									<CardContent>
										<p className="text-slate-600 leading-relaxed">
											Génération automatique de rapports détaillés post-événement avec recommandations pour vos futurs événements.
										</p>
									</CardContent>
								</Card>

								<Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-md hover:shadow-rose-500/10">
									<CardHeader>
										<div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-rose-600 text-white shadow-lg">
											<svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
											</svg>
										</div>
										<CardTitle className="text-xl group-hover:text-rose-600 transition-colors">Performance en temps réel</CardTitle>
									</CardHeader>
									<CardContent>
										<p className="text-slate-600 leading-relaxed">
											Monitoring en temps réel de vos événements avec alertes automatiques et optimisations en continu.
										</p>
									</CardContent>
								</Card>
							</div>
						</TabsContent>
					</Tabs>
				</div>
			</section>

			{/* Social Proof & Stats */}
			<section className="py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 text-white">
				<div className="container mx-auto px-6">
					<div className="mx-auto max-w-4xl text-center mb-16">
						<h2 className="mb-6 text-4xl font-bold lg:text-5xl">
							Ils nous font confiance
						</h2>
						<p className="text-xl text-slate-300">
							Rejoignez des milliers d'organisateurs qui créent des événements extraordinaires
						</p>
					</div>

					{/* Stats */}
					<div className="grid gap-8 md:grid-cols-4 mb-20">
						<div className="text-center">
							<div className="mb-2 text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">25k+</div>
							<div className="text-slate-300">Événements créés</div>
						</div>
						<div className="text-center">
							<div className="mb-2 text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">150k+</div>
							<div className="text-slate-300">Utilisateurs actifs</div>
						</div>
						<div className="text-center">
							<div className="mb-2 text-5xl font-bold bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">99.8%</div>
							<div className="text-slate-300">Satisfaction client</div>
						</div>
						<div className="text-center">
							<div className="mb-2 text-5xl font-bold bg-gradient-to-r from-rose-400 to-orange-400 bg-clip-text text-transparent">24/7</div>
							<div className="text-slate-300">Support premium</div>
						</div>
					</div>

					{/* Testimonials */}
					<div className="grid gap-8 md:grid-cols-3">
						<Card className="bg-white/10 border-white/20 backdrop-blur-sm">
							<CardContent className="pt-6">
								<div className="flex items-start space-x-4">
									<Avatar className="h-12 w-12">
										<AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">MT</AvatarFallback>
									</Avatar>
									<div>
										<p className="text-slate-200 mb-4 leading-relaxed">
											"EventMaster a révolutionné notre façon d'organiser nos événements d'entreprise. Interface intuitive et fonctionnalités exceptionnelles !"
										</p>
										<div>
											<div className="font-semibold text-white">Marie Dubois</div>
											<div className="text-sm text-slate-400">Directrice Marketing, TechCorp</div>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>

						<Card className="bg-white/10 border-white/20 backdrop-blur-sm">
							<CardContent className="pt-6">
								<div className="flex items-start space-x-4">
									<Avatar className="h-12 w-12">
										<AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">JL</AvatarFallback>
									</Avatar>
									<div>
										<p className="text-slate-200 mb-4 leading-relaxed">
											"Grâce à EventMaster, j'ai pu organiser mon mariage de rêve sans stress. Les outils de coordination sont fantastiques !"
										</p>
										<div>
											<div className="font-semibold text-white">Julie Leroy</div>
											<div className="text-sm text-slate-400">Wedding Planner</div>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>

						<Card className="bg-white/10 border-white/20 backdrop-blur-sm">
							<CardContent className="pt-6">
								<div className="flex items-start space-x-4">
									<Avatar className="h-12 w-12">
										<AvatarFallback className="bg-gradient-to-br from-pink-500 to-rose-500 text-white">PM</AvatarFallback>
									</Avatar>
									<div>
										<p className="text-slate-200 mb-4 leading-relaxed">
											"La meilleure plateforme que j'aie jamais utilisée. Les analytiques nous aident à améliorer chaque événement."
										</p>
										<div>
											<div className="font-semibold text-white">Pierre Martin</div>
											<div className="text-sm text-slate-400">Event Manager, StartupHub</div>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</section>

			{/* Pricing Section */}
			<section id="pricing" className="py-24 bg-white">
				<div className="container mx-auto px-6">
					<div className="mx-auto max-w-3xl text-center mb-16">
						<Badge variant="outline" className="mb-4 border-purple-200 text-purple-700">
							Tarification
						</Badge>
						<h2 className="mb-6 text-4xl font-bold text-slate-900 lg:text-5xl">
							Des tarifs adaptés à
							<span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> tous vos besoins</span>
						</h2>
						<p className="text-xl text-slate-600">
							Choisissez l'offre qui correspond à vos ambitions. Changez à tout moment.
						</p>
					</div>

					<div className="grid gap-8 lg:grid-cols-3 lg:gap-12">
						{/* Starter Plan */}
						<Card className="relative border-2 border-slate-200 hover:border-blue-300 transition-all duration-300">
							<CardHeader className="text-center pb-8">
								<CardTitle className="text-2xl font-bold text-slate-900">Starter</CardTitle>
								<div className="mt-4">
									<span className="text-5xl font-bold text-slate-900">Gratuit</span>
								</div>
								<p className="text-slate-600 mt-2">Pour découvrir EventMaster</p>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="space-y-3">
									<div className="flex items-center space-x-3">
										<div className="h-2 w-2 rounded-full bg-green-500"></div>
										<span className="text-slate-700">Jusqu'à 3 événements/mois</span>
									</div>
									<div className="flex items-center space-x-3">
										<div className="h-2 w-2 rounded-full bg-green-500"></div>
										<span className="text-slate-700">50 invités maximum</span>
									</div>
									<div className="flex items-center space-x-3">
										<div className="h-2 w-2 rounded-full bg-green-500"></div>
										<span className="text-slate-700">Templates de base</span>
									</div>
									<div className="flex items-center space-x-3">
										<div className="h-2 w-2 rounded-full bg-green-500"></div>
										<span className="text-slate-700">Support par email</span>
									</div>
								</div>
								<Separator className="my-6" />
								<Button variant="outline" className="w-full border-slate-300" asChild>
									<Link href="/login">
										Commencer gratuitement
									</Link>
								</Button>
							</CardContent>
						</Card>

						{/* Pro Plan */}
						<Card className="relative border-2 border-blue-500 shadow-xl shadow-blue-500/25 scale-105">
							<Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
								Populaire
							</Badge>
							<CardHeader className="text-center pb-8">
								<CardTitle className="text-2xl font-bold text-slate-900">Pro</CardTitle>
								<div className="mt-4">
									<span className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">29€</span>
									<span className="text-slate-600">/mois</span>
								</div>
								<p className="text-slate-600 mt-2">Pour les professionnels</p>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="space-y-3">
									<div className="flex items-center space-x-3">
										<div className="h-2 w-2 rounded-full bg-green-500"></div>
										<span className="text-slate-700">Événements illimités</span>
									</div>
									<div className="flex items-center space-x-3">
										<div className="h-2 w-2 rounded-full bg-green-500"></div>
										<span className="text-slate-700">1000 invités maximum</span>
									</div>
									<div className="flex items-center space-x-3">
										<div className="h-2 w-2 rounded-full bg-green-500"></div>
										<span className="text-slate-700">Templates premium + IA</span>
									</div>
									<div className="flex items-center space-x-3">
										<div className="h-2 w-2 rounded-full bg-green-500"></div>
										<span className="text-slate-700">Analytiques avancées</span>
									</div>
									<div className="flex items-center space-x-3">
										<div className="h-2 w-2 rounded-full bg-green-500"></div>
										<span className="text-slate-700">Support prioritaire</span>
									</div>
								</div>
								<Separator className="my-6" />
								<Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" asChild>
									<Link href="/login">
										Démarrer l'essai gratuit
									</Link>
								</Button>
							</CardContent>
						</Card>

						{/* Enterprise Plan */}
						<Card className="relative border-2 border-slate-200 hover:border-purple-300 transition-all duration-300">
							<CardHeader className="text-center pb-8">
								<CardTitle className="text-2xl font-bold text-slate-900">Enterprise</CardTitle>
								<div className="mt-4">
									<span className="text-5xl font-bold text-slate-900">Sur mesure</span>
								</div>
								<p className="text-slate-600 mt-2">Pour les grandes organisations</p>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="space-y-3">
									<div className="flex items-center space-x-3">
										<div className="h-2 w-2 rounded-full bg-green-500"></div>
										<span className="text-slate-700">Tout illimité</span>
									</div>
									<div className="flex items-center space-x-3">
										<div className="h-2 w-2 rounded-full bg-green-500"></div>
										<span className="text-slate-700">Multi-organisations</span>
									</div>
									<div className="flex items-center space-x-3">
										<div className="h-2 w-2 rounded-full bg-green-500"></div>
										<span className="text-slate-700">API personnalisée</span>
									</div>
									<div className="flex items-center space-x-3">
										<div className="h-2 w-2 rounded-full bg-green-500"></div>
										<span className="text-slate-700">Support dédié 24/7</span>
									</div>
									<div className="flex items-center space-x-3">
										<div className="h-2 w-2 rounded-full bg-green-500"></div>
										<span className="text-slate-700">Formation incluse</span>
									</div>
								</div>
								<Separator className="my-6" />
								<Button variant="outline" className="w-full border-slate-300" asChild>
									<Link href="#contact">
										Nous contacter
									</Link>
								</Button>
							</CardContent>
						</Card>
					</div>
				</div>
			</section>

			{/* Final CTA Section */}
			<section className="py-24 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
				<div className="container mx-auto px-6">
					<Card className="mx-auto max-w-4xl bg-white/80 backdrop-blur-sm border-0 shadow-2xl shadow-blue-500/20">
						<CardContent className="p-12 text-center">
							<Badge variant="secondary" className="mb-6 border-blue-200 bg-blue-50 text-blue-700">
								🚀 Prêt à décoller ?
							</Badge>
							<h2 className="mb-6 text-4xl font-bold text-slate-900 lg:text-5xl">
								Créez votre premier événement
								<span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> en 5 minutes</span>
							</h2>
							<p className="mx-auto mb-10 max-w-2xl text-xl text-slate-600 leading-relaxed">
								Rejoignez des milliers d'organisateurs qui transforment leurs idées en événements extraordinaires avec EventMaster.
							</p>
							<div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
								<Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-10 py-4 text-lg shadow-lg shadow-blue-500/25" asChild>
									<Link href="/login">
										Commencer maintenant
									</Link>
								</Button>
								<Button size="lg" variant="outline" className="px-8 py-4 text-lg border-slate-300" asChild>
									<Link href="#contact">
										Parler à un expert
									</Link>
								</Button>
							</div>
							<div className="mt-8 flex items-center justify-center gap-8 text-sm text-slate-600">
								<div className="flex items-center gap-2">
									<svg className="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
										<path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
									</svg>
									Essai gratuit 30 jours
								</div>
								<div className="flex items-center gap-2">
									<svg className="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
										<path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
									</svg>
									Aucune carte requise
								</div>
								<div className="flex items-center gap-2">
									<svg className="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
										<path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
									</svg>
									Annulation facile
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			</section>

			{/* Footer */}
			<footer className="bg-slate-900 text-white py-16">
				<div className="container mx-auto px-6">
					<div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
						{/* Brand Section */}
						<div className="lg:col-span-2">
							<div className="flex items-center space-x-2 mb-6">
								<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600">
									<span className="text-lg font-bold text-white">E</span>
								</div>
							</div>
							<p className="text-slate-400 mb-6 max-w-md leading-relaxed">
								La plateforme de référence pour créer des événements extraordinaires.
								Transformez vos idées en expériences mémorables avec nos outils professionnels.
							</p>
							<div className="flex space-x-4">
								<Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-slate-800">
									<svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
										<path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
									</svg>
								</Button>
								<Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-slate-800">
									<svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
										<path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
									</svg>
								</Button>
								<Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-slate-800">
									<svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
										<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
									</svg>
								</Button>
								<Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-slate-800">
									<svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
										<path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.166-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24c6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001.012.001z"/>
									</svg>
								</Button>
							</div>
						</div>

						{/* Product Column */}
						<div>
							<h4 className="mb-6 text-lg font-semibold text-white">Produit</h4>
							<ul className="space-y-3">
								<li>
									<Link href="#features" className="text-slate-400 hover:text-white transition-colors">
										Fonctionnalités
									</Link>
								</li>
								<li>
									<Link href="#pricing" className="text-slate-400 hover:text-white transition-colors">
										Tarifs
									</Link>
								</li>
								<li>
									<Link href="#" className="text-slate-400 hover:text-white transition-colors">
										API & Intégrations
									</Link>
								</li>
								<li>
									<Link href="#" className="text-slate-400 hover:text-white transition-colors">
										Mobile App
									</Link>
								</li>
								<li>
									<Link href="#" className="text-slate-400 hover:text-white transition-colors">
										Sécurité
									</Link>
								</li>
							</ul>
						</div>

						{/* Support Column */}
						<div>
							<h4 className="mb-6 text-lg font-semibold text-white">Support</h4>
							<ul className="space-y-3">
								<li>
									<Link href="#" className="text-slate-400 hover:text-white transition-colors">
										Centre d'aide
									</Link>
								</li>
								<li>
									<Link href="#" className="text-slate-400 hover:text-white transition-colors">
										Documentation
									</Link>
								</li>
								<li>
									<Link href="#" className="text-slate-400 hover:text-white transition-colors">
										Tutoriels
									</Link>
								</li>
								<li>
									<Link href="#" className="text-slate-400 hover:text-white transition-colors">
										Communauté
									</Link>
								</li>
								<li>
									<Link href="#contact" className="text-slate-400 hover:text-white transition-colors">
										Nous contacter
									</Link>
								</li>
							</ul>
						</div>

						{/* Company Column */}
						<div>
							<h4 className="mb-6 text-lg font-semibold text-white">Entreprise</h4>
							<ul className="space-y-3">
								<li>
									<Link href="#" className="text-slate-400 hover:text-white transition-colors">
										À propos
									</Link>
								</li>
								<li>
									<Link href="#" className="text-slate-400 hover:text-white transition-colors">
										Blog
									</Link>
								</li>
								<li>
									<Link href="#" className="text-slate-400 hover:text-white transition-colors">
										Carrières
									</Link>
								</li>
								<li>
									<Link href="#" className="text-slate-400 hover:text-white transition-colors">
										Presse
									</Link>
								</li>
								<li>
									<Link href="#" className="text-slate-400 hover:text-white transition-colors">
										Partenaires
									</Link>
								</li>
							</ul>
						</div>
					</div>

					<Separator className="my-12 bg-slate-700" />

					{/* Bottom Footer */}
					<div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
						<div className="text-slate-400">
							© 2024 EventMaster. Tous droits réservés.
						</div>
						<div className="flex space-x-6 text-sm">
							<Link href="#" className="text-slate-400 hover:text-white transition-colors">
								Politique de confidentialité
							</Link>
							<Link href="#" className="text-slate-400 hover:text-white transition-colors">
								Conditions d'utilisation
							</Link>
							<Link href="#" className="text-slate-400 hover:text-white transition-colors">
								Cookies
							</Link>
						</div>
					</div>
				</div>
			</footer>
		</main>
	);
}
