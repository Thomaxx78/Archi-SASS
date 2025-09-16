import Link from "next/link";

export default function Landing() {
    return (
        <main className="min-h-screen bg-white">
            {/* Navigation */}
            <nav className="border-b border-stone-200 bg-white">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="text-2xl font-bold text-stone-800">EventMaster</div>
                        <Link
                            href="/api/auth/signin"
                            className="rounded-lg bg-lime-900 px-4 py-2 font-medium text-white transition hover:bg-lime-900"
                        >
                            Se connecter
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="bg-gradient-to-br from-stone-50 to-stone-100 py-24">
                <div className="container mx-auto px-6 text-center">
                    <h1 className="mb-6 text-6xl font-bold text-stone-800">
                        Organisez vos événements
                        <span className="block text-stone-600">en toute simplicité</span>
                    </h1>
                    <p className="mx-auto mb-10 max-w-3xl text-xl text-stone-600">
                        EventMaster est la plateforme complète pour créer, gérer et coordonner vos événements.
                        De l'invitation des participants aux sondages, tout est centralisé pour une organisation parfaite.
                    </p>
                    <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                        <Link
                            href="/api/auth/signin"
                            className="rounded-lg bg-lime-900 px-8 py-4 text-lg font-semibold text-white transition hover:bg-lime-900"
                        >
                            Commencer gratuitement
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-24">
                <div className="container mx-auto px-6">
                    <div className="mb-16 text-center">
                        <h2 className="mb-4 text-4xl font-bold text-stone-800">Tout ce dont vous avez besoin</h2>
                        <p className="text-xl text-stone-600">Une solution complète pour vos événements</p>
                    </div>

                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        <div className="rounded-2xl bg-stone-100 p-8 transition hover:shadow-lg">
                            <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-xl bg-stone-100">
                                <span className="text-2xl">📅</span>
                            </div>
                            <h3 className="mb-4 text-xl font-semibold text-stone-800">Création d'événements</h3>
                            <p className="text-stone-600">
                                Interface intuitive pour créer vos événements avec tous les détails nécessaires.
                                Planification, localisation et personnalisation complète.
                            </p>
                        </div>

                        <div className="rounded-2xl bg-stone-100 p-8 transition hover:shadow-lg">
                            <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-xl bg-stone-200">
                                <span className="text-2xl">👥</span>
                            </div>
                            <h3 className="mb-4 text-xl font-semibold text-stone-800">Gestion des invités</h3>
                            <p className="text-stone-600">
                                Invitez facilement vos participants, suivez les confirmations et gérez
                                les listes d'invités en temps réel.
                            </p>
                        </div>

                        <div className="rounded-2xl bg-stone-100 p-8 transition hover:shadow-lg">
                            <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-xl bg-stone-200">
                                <span className="text-2xl">📊</span>
                            </div>
                            <h3 className="mb-4 text-xl font-semibold text-stone-800">Sondages intégrés</h3>
                            <p className="text-stone-600">
                                Créez des sondages pour vos invités et collectez leurs préférences
                                pour une organisation optimale.
                            </p>
                        </div>

                        <div className="rounded-2xl bg-stone-100 p-8 transition hover:shadow-lg">
                            <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-xl bg-stone-200">
                                <span className="text-2xl">🎯</span>
                            </div>
                            <h3 className="mb-4 text-xl font-semibold text-stone-800">Coordination avancée</h3>
                            <p className="text-stone-600">
                                Outils de coordination pour planifier chaque aspect de votre événement
                                et assurer son succès.
                            </p>
                        </div>

                        <div className="rounded-2xl bg-stone-100 p-8 transition hover:shadow-lg">
                            <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-xl bg-stone-200">
                                <span className="text-2xl">📱</span>
                            </div>
                            <h3 className="mb-4 text-xl font-semibold text-stone-800">Notifications</h3>
                            <p className="text-stone-600">
                                Système de notifications automatiques pour tenir vos invités
                                informés des dernières mises à jour.
                            </p>
                        </div>

                        <div className="rounded-2xl bg-stone-100 p-8 transition hover:shadow-lg">
                            <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-xl bg-stone-200">
                                <span className="text-2xl">📈</span>
                            </div>
                            <h3 className="mb-4 text-xl font-semibold text-stone-800">Analytiques</h3>
                            <p className="text-stone-600">
                                Tableaux de bord détaillés pour analyser la participation
                                et améliorer vos futurs événements.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="bg-stone-800 py-20 text-white">
                <div className="container mx-auto px-6">
                    <div className="grid gap-8 md:grid-cols-3">
                        <div className="text-center">
                            <div className="mb-2 text-4xl font-bold">10k+</div>
                            <div className="text-stone-300">Événements créés</div>
                        </div>
                        <div className="text-center">
                            <div className="mb-2 text-4xl font-bold">50k+</div>
                            <div className="text-stone-300">Utilisateurs actifs</div>
                        </div>
                        <div className="text-center">
                            <div className="mb-2 text-4xl font-bold">98%</div>
                            <div className="text-stone-300">Satisfaction client</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-gradient-to-br from-stone-50 to-stone-100 py-24">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="mb-6 text-4xl font-bold text-stone-800">
                        Prêt à organiser votre prochain événement ?
                    </h2>
                    <p className="mx-auto mb-10 max-w-2xl text-xl text-stone-600">
                        Rejoignez des milliers d'organisateurs qui font confiance à EventMaster
                        pour créer des événements mémorables et parfaitement coordonnés.
                    </p>
                    <Link
                        href="/api/auth/signin"
                        className="rounded-lg bg-lime-900 px-10 py-4 text-lg font-semibold text-white transition hover:bg-lime-900"
                    >
                        Créer mon premier événement
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-stone-200 bg-white py-12">
                <div className="container mx-auto px-6">
                    <div className="grid gap-8 md:grid-cols-4">
                        <div>
                            <h3 className="mb-4 text-lg font-semibold text-stone-800">EventMaster</h3>
                            <p className="text-stone-600">
                                La plateforme de référence pour l'organisation d'événements professionnels et personnels.
                            </p>
                        </div>
                        <div>
                            <h4 className="mb-4 font-medium text-stone-800">Produit</h4>
                            <ul className="space-y-2 text-stone-600">
                                <li><a href="#" className="hover:text-stone-800">Fonctionnalités</a></li>
                                <li><a href="#" className="hover:text-stone-800">Tarifs</a></li>
                                <li><a href="#" className="hover:text-stone-800">API</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="mb-4 font-medium text-stone-800">Support</h4>
                            <ul className="space-y-2 text-stone-600">
                                <li><a href="#" className="hover:text-stone-800">Documentation</a></li>
                                <li><a href="#" className="hover:text-stone-800">Aide</a></li>
                                <li><a href="#" className="hover:text-stone-800">Contact</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="mb-4 font-medium text-stone-800">Entreprise</h4>
                            <ul className="space-y-2 text-stone-600">
                                <li><a href="#" className="hover:text-stone-800">À propos</a></li>
                                <li><a href="#" className="hover:text-stone-800">Blog</a></li>
                                <li><a href="#" className="hover:text-stone-800">Carrières</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-8 border-t border-stone-200 pt-8 text-center text-stone-600">
                        © 2024 EventMaster. Tous droits réservés.
                    </div>
                </div>
            </footer>
        </main> 
    );
}
