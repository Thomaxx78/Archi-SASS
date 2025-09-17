"use client";

import Link from "next/link";
import { type Session } from "next-auth";
import { api } from "~/trpc/react";

interface DashboardProps {
    session: Session;
}

export default function Dashboard({ session }: DashboardProps) {
    const { data: events, isLoading, error } = api.event.getAll.useQuery();

    const userEvents = events?.map(event => ({
        id: event.id,
        title: event.title,
        date: event.startDate.toISOString().split('T')[0],
        time: event.startDate.toTimeString().slice(0, 5),
        location: event.location ?? "À définir",
        participants: event.invitations.reduce((acc, inv) => acc + inv.responses.length, 0),
        status: event.status === "PUBLISHED" ? "created" : "joined",
        type: "meeting"
    })) ?? [];

    if (isLoading) {
        return (
            <main className="min-h-screen bg-stone-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-lime-900 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-stone-600">Chargement des événements...</p>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="min-h-screen bg-stone-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">⚠️</span>
                    </div>
                    <p className="text-stone-800 font-semibold mb-2">Erreur de chargement</p>
                    <p className="text-stone-600">Impossible de charger les événements. Veuillez réessayer.</p>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-stone-50">
            {/* Header */}
            <header className="border-b border-stone-200 bg-white">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="text-2xl font-bold text-stone-800">EventMaster</div>
                        <div className="flex items-center gap-4">
                            <span className="text-stone-600">
                                Bonjour, {session.user?.name ?? session.user?.email}
                            </span>
                            <Link
                                href="/api/auth/signout"
                                className="rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-50"
                            >
                                Se déconnecter
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Dashboard Content */}
            <div className="container mx-auto px-6 py-8">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-stone-800">Mes événements</h1>
                        <p className="mt-2 text-stone-600">
                            Gérez vos événements créés et ceux auxquels vous participez
                        </p>
                    </div>
                    <button className="rounded-lg bg-lime-900 px-6 py-3 font-semibold text-white transition hover:bg-lime-800">
                        + Créer un événement
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="mb-8 grid gap-6 md:grid-cols-3">
                    <div className="rounded-xl bg-white p-6 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="rounded-lg bg-lime-100 p-3">
                                <span className="text-xl">📅</span>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-stone-800">
                                    {userEvents.filter(e => e.status === 'created').length}
                                </p>
                                <p className="text-stone-600">Événements créés</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl bg-white p-6 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="rounded-lg bg-stone-200 p-3">
                                <span className="text-xl">👥</span>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-stone-800">
                                    {userEvents.filter(e => e.status === 'joined').length}
                                </p>
                                <p className="text-stone-600">Événements rejoints</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl bg-white p-6 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="rounded-lg bg-stone-200 p-3">
                                <span className="text-xl">📊</span>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-stone-800">
                                    {userEvents.reduce((acc, e) => acc + e.participants, 0)}
                                </p>
                                <p className="text-stone-600">Total participants</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Events List */}
                <div className="rounded-xl bg-white shadow-sm">
                    <div className="border-b border-stone-200 px-6 py-4">
                        <h2 className="text-xl font-semibold text-stone-800">Tous les événements</h2>
                    </div>
                    <div className="divide-y divide-stone-200">
                        {userEvents.map((event) => (
                            <div key={event.id} className="p-6 transition hover:bg-stone-50">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-start gap-4">
                                        <div className="rounded-lg bg-lime-100 p-2">
                                            <span className="text-lg">
                                                {event.type === 'meeting' ? '💼' :
                                                 event.type === 'celebration' ? '🎉' : '📚'}
                                            </span>
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3">
                                                <h3 className="text-lg font-semibold text-stone-800">
                                                    {event.title}
                                                </h3>
                                                <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                                                    event.status === 'created'
                                                        ? 'bg-lime-100 text-lime-800'
                                                        : 'bg-stone-100 text-stone-800'
                                                }`}>
                                                    {event.status === 'created' ? 'Organisateur' : 'Participant'}
                                                </span>
                                            </div>
                                            <div className="mt-2 flex items-center gap-6 text-sm text-stone-600">
                                                <div className="flex items-center gap-1">
                                                    <span>📅</span>
                                                    <span>{event.date ? new Date(event.date).toLocaleDateString('fr-FR') : 'Date à définir'}</span>
                                                    <span>à {event.time}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <span>📍</span>
                                                    <span>{event.location}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <span>👥</span>
                                                    <span>{event.participants} participants</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button className="rounded-lg border border-stone-300 px-3 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-50">
                                            Voir détails
                                        </button>
                                        {event.status === 'created' && (
                                            <button className="rounded-lg bg-lime-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-lime-800">
                                                Gérer
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Empty State */}
                {userEvents.length === 0 && (
                    <div className="rounded-xl bg-white py-16 text-center shadow-sm">
                        <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-stone-100 p-4">
                            <span className="text-2xl">📅</span>
                        </div>
                        <h3 className="mb-2 text-xl font-semibold text-stone-800">
                            Aucun événement pour le moment
                        </h3>
                        <p className="mb-6 text-stone-600">
                            Créez votre premier événement ou rejoignez-en un existant
                        </p>
                        <button className="rounded-lg bg-lime-900 px-6 py-3 font-semibold text-white transition hover:bg-lime-800">
                            Créer mon premier événement
                        </button>
                    </div>
                )}
            </div>
        </main>
    );
}
