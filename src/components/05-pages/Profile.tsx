"use client";

import Link from "next/link";
import { type Session } from "next-auth";
import { api } from "~/trpc/react";
import { useState, useEffect } from "react";

interface ProfileProps {
    session: Session;
}

export default function Profile({ session }: ProfileProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        description: ""
    });

    const { data: profile, isLoading, error, refetch } = api.user.getProfile.useQuery();
    const updateProfile = api.user.updateProfile.useMutation({
        onSuccess: () => {
            setIsEditing(false);
            refetch();
        },
    });

    // Initialize form data when profile loads
    useEffect(() => {
        if (profile) {
            setFormData({
                firstName: (profile as any).firstName ?? "",
                lastName: (profile as any).lastName ?? "",
                description: (profile as any).description ?? ""
            });
        }
    }, [profile]);

    if (isLoading) {
        return (
            <main className="min-h-screen bg-stone-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-lime-900 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-stone-600">Chargement du profil...</p>
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
                    <p className="text-stone-600">Impossible de charger votre profil. Veuillez réessayer.</p>
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
                        <div className="flex items-center gap-4">
                            <Link
                                href="/dashboard"
                                className="text-stone-600 hover:text-stone-800 transition"
                            >
                                ← Retour au dashboard
                            </Link>
                            <div className="text-2xl font-bold text-stone-800">EventMaster</div>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-stone-600">
                                {(profile as any)?.firstName && (profile as any)?.lastName
                                    ? `${(profile as any).firstName} ${(profile as any).lastName}`
                                    : session.user?.name ?? session.user?.email}
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

            {/* Profile Content */}
            <div className="container mx-auto px-6 py-8">
                <div className="max-w-2xl mx-auto">
                    <div className="mb-8 flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-stone-800">Mon profil</h1>
                            <p className="mt-2 text-stone-600">
                                Gérez vos informations personnelles
                            </p>
                        </div>
                        {!isEditing && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="rounded-lg bg-lime-900 px-6 py-3 font-semibold text-white transition hover:bg-lime-800"
                            >
                                Modifier le profil
                            </button>
                        )}
                    </div>

                    {/* Profile Card */}
                    <div className="rounded-xl bg-white shadow-sm">
                        <div className="border-b border-stone-200 px-6 py-4">
                            <h2 className="text-xl font-semibold text-stone-800">Informations personnelles</h2>
                        </div>

                        <div className="p-6">
                            {isEditing ? (
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        updateProfile.mutate({
                                            firstName: formData.firstName || undefined,
                                            lastName: formData.lastName || undefined,
                                            description: formData.description || undefined,
                                        });
                                    }}
                                    className="space-y-6"
                                >
                                    <div className="grid gap-6 md:grid-cols-2">
                                        <div>
                                            <label className="block text-sm font-medium text-stone-700 mb-2">
                                                Prénom
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.firstName}
                                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                                className="w-full rounded-lg border border-stone-300 px-3 py-2 focus:border-lime-500 focus:outline-none"
                                                placeholder="Votre prénom"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-stone-700 mb-2">
                                                Nom de famille
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.lastName}
                                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                                className="w-full rounded-lg border border-stone-300 px-3 py-2 focus:border-lime-500 focus:outline-none"
                                                placeholder="Votre nom de famille"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-stone-700 mb-2">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            value={profile?.email ?? ""}
                                            disabled
                                            className="w-full rounded-lg border border-stone-300 px-3 py-2 bg-stone-50 text-stone-500 cursor-not-allowed"
                                        />
                                        <p className="mt-1 text-xs text-stone-500">
                                            L'email ne peut pas être modifié
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-stone-700 mb-2">
                                            Description
                                        </label>
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            rows={4}
                                            className="w-full rounded-lg border border-stone-300 px-3 py-2 focus:border-lime-500 focus:outline-none"
                                            placeholder="Parlez-nous un peu de vous..."
                                        />
                                    </div>

                                    <div className="flex gap-3 pt-4">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsEditing(false);
                                                setFormData({
                                                    firstName: (profile as any)?.firstName ?? "",
                                                    lastName: (profile as any)?.lastName ?? "",
                                                    description: (profile as any)?.description ?? ""
                                                });
                                            }}
                                            className="flex-1 rounded-lg border border-stone-300 px-4 py-2 font-medium text-stone-700 transition hover:bg-stone-50"
                                        >
                                            Annuler
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={updateProfile.isPending}
                                            className="flex-1 rounded-lg bg-lime-900 px-4 py-2 font-medium text-white transition hover:bg-lime-800 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {updateProfile.isPending ? "Enregistrement..." : "Enregistrer"}
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <div className="space-y-6">
                                    <div className="grid gap-6 md:grid-cols-2">
                                        <div>
                                            <label className="block text-sm font-medium text-stone-700 mb-2">
                                                Prénom
                                            </label>
                                            <p className="text-stone-800">
                                                {(profile as any)?.firstName || <span className="text-stone-400 italic">Non renseigné</span>}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-stone-700 mb-2">
                                                Nom de famille
                                            </label>
                                            <p className="text-stone-800">
                                                {(profile as any)?.lastName || <span className="text-stone-400 italic">Non renseigné</span>}
                                            </p>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-stone-700 mb-2">
                                            Email
                                        </label>
                                        <p className="text-stone-800">{profile?.email}</p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-stone-700 mb-2">
                                            Description
                                        </label>
                                        <p className="text-stone-800">
                                            {(profile as any)?.description || <span className="text-stone-400 italic">Aucune description</span>}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {updateProfile.error && (
                                <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                                    Erreur lors de la mise à jour du profil. Veuillez réessayer.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}