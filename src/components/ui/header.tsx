"use client";

import Link from "next/link";
import { type Session } from "next-auth";
import { Button } from "~/components/ui/button";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";

interface HeaderProps {
	session: Session;
	profile?: any;
	mounted?: boolean;
}

export function Header({ session, profile, mounted = false }: HeaderProps) {
	return (
		<header className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/80 backdrop-blur-lg">
			<div className="container mx-auto px-6 py-4">
				<div className="flex items-center justify-between">
					<div className="flex items-center space-x-2">
						<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600">
							<span className="text-sm font-bold text-white">E</span>
						</div>
					</div>
					<div className="flex items-center gap-4">
						<div className="flex items-center gap-3">
							<Avatar className="h-8 w-8">
								<AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-sm">
									{mounted ? ((profile as any)?.firstName?.charAt(0) ?? session.user?.name?.charAt(0) ?? session.user?.email?.charAt(0) ?? "U") : "U"}
								</AvatarFallback>
							</Avatar>
							<div className="hidden sm:block">
								<p className="text-sm font-medium text-slate-700">
									{mounted ? ((profile as any)?.firstName && (profile as any)?.lastName
										? `${(profile as any).firstName} ${(profile as any).lastName}`
										: (session.user?.name ?? "Utilisateur")) : "Utilisateur"}
								</p>
								<p className="text-xs text-slate-500">
									{mounted ? session.user?.email : ""}
								</p>
							</div>
						</div>
						<Button variant="ghost" size="sm" asChild>
							<Link href="/profile">
								Mon profil
							</Link>
						</Button>
						<Button variant="outline" size="sm" asChild>
							<Link href="/api/auth/signout">
								Se déconnecter
							</Link>
						</Button>
					</div>
				</div>
			</div>
		</header>
	);
}