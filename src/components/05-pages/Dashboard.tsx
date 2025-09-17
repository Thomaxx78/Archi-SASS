"use client";

import Link from "next/link";
import { type Session } from "next-auth";
import { api } from "~/trpc/react";
import { useState } from "react";

interface DashboardProps {
    session: Session;
}

export default function Dashboard({ session }: DashboardProps) {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        startDate: "",
        endDate: "",
        location: ""
    });

    const { data: events, isLoading, error, refetch } = api.event.getAll.useQuery();
    const createEvent = api.event.create.useMutation({
        onSuccess: () => {
            setShowCreateModal(false);
            setFormData({
                title: "",
                description: "",
                startDate: "",
                endDate: "",
                location: ""
            });
            refetch();
        },
    });

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
                                href="/profile"
                                className="rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-50"
                            >
                                Mon profil
                            </Link>
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
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="rounded-lg bg-lime-900 px-6 py-3 font-semibold text-white transition hover:bg-lime-800"
                    >
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
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="rounded-lg bg-lime-900 px-6 py-3 font-semibold text-white transition hover:bg-lime-800"
                        >
                            Créer mon premier événement
                        </button>
                    </div>
                )}
            </div>

            {/* Create Event Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="mx-4 w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-stone-800">Créer un événement</h2>
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="text-stone-400 hover:text-stone-600"
                            >
                                ✕
                            </button>
                        </div>

                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                createEvent.mutate({
                                    title: formData.title,
                                    description: formData.description || undefined,
                                    startDate: new Date(formData.startDate),
                                    endDate: formData.endDate ? new Date(formData.endDate) : undefined,
                                    location: formData.location || undefined,
                                });
                            }}
                            className="space-y-4"
                        >
                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-1">
                                    Titre <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full rounded-lg border border-stone-300 px-3 py-2 focus:border-lime-500 focus:outline-none"
                                    placeholder="Ex: Réunion équipe"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-1">
                                    Description
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={3}
                                    className="w-full rounded-lg border border-stone-300 px-3 py-2 focus:border-lime-500 focus:outline-none"
                                    placeholder="Décrivez votre événement..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-1">
                                    Date de début <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="datetime-local"
                                    required
                                    value={formData.startDate}
                                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                    className="w-full rounded-lg border border-stone-300 px-3 py-2 focus:border-lime-500 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-1">
                                    Date de fin
                                </label>
                                <input
                                    type="datetime-local"
                                    value={formData.endDate}
                                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                    className="w-full rounded-lg border border-stone-300 px-3 py-2 focus:border-lime-500 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-1">
                                    Lieu
                                </label>
                                <input
                                    type="text"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    className="w-full rounded-lg border border-stone-300 px-3 py-2 focus:border-lime-500 focus:outline-none"
                                    placeholder="Ex: Salle de conférence A"
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    className="flex-1 rounded-lg border border-stone-300 px-4 py-2 font-medium text-stone-700 transition hover:bg-stone-50"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    disabled={createEvent.isPending || !formData.title || !formData.startDate}
                                    className="flex-1 rounded-lg bg-lime-900 px-4 py-2 font-medium text-white transition hover:bg-lime-800 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {createEvent.isPending ? "Création..." : "Créer"}
                                </button>
                            </div>
                        </form>

                        {createEvent.error && (
                            <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                                Erreur lors de la création de l'événement. Veuillez réessayer.
                            </div>
                        )}
                    </div>
                </div>
            )}
        </main>
    );
}
