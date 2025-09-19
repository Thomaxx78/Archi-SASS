"use client";

import { useState } from "react";
import { Bell } from "lucide-react";
import { useSession } from "next-auth/react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "~/components/ui/sheet";
import { api } from "~/trpc/react";

// Utilisons un type simple au lieu du type complexe auto-généré

const getNotificationIcon = (type: string) => {
	switch (type) {
		case "SUCCESS":
			return "✅";
		case "WARNING":
			return "⚠️";
		case "ERROR":
			return "❌";
		case "EVENT_INVITATION":
			return "📅";
		case "EVENT_UPDATE":
			return "🔄";
		case "SUBSCRIPTION_UPDATE":
			return "💳";
		default:
			return "ℹ️";
	}
};

const getNotificationColor = (type: string) => {
	switch (type) {
		case "SUCCESS":
			return "text-green-600";
		case "WARNING":
			return "text-yellow-600";
		case "ERROR":
			return "text-red-600";
		case "EVENT_INVITATION":
			return "text-blue-600";
		case "EVENT_UPDATE":
			return "text-purple-600";
		case "SUBSCRIPTION_UPDATE":
			return "text-indigo-600";
		default:
			return "text-gray-600";
	}
};

export function NotificationDropdown() {
	const [isOpen, setIsOpen] = useState(false);
	const { data: session } = useSession();

	const { data: notifications = [], refetch } = api.notification.getAll.useQuery(undefined, {
		enabled: !!session?.user, // Ne charger que si l'utilisateur est connecté
		refetchInterval: 30000, // Refresh every 30 seconds
		retry: false, // Éviter les retries en cas d'erreur d'auth
	});

	const markAllAsReadMutation = api.notification.markAllAsRead.useMutation({
		onSuccess: () => {
			void refetch();
		},
	});

	const unreadCount = notifications.filter((n) => !n.isRead).length;

	const handleOpenChange = (open: boolean) => {
		setIsOpen(open);

		// Marquer toutes les notifications comme lues dès l'ouverture
		if (open && unreadCount > 0) {
			markAllAsReadMutation.mutate();
		}
	};

	return (
		<Sheet open={isOpen} onOpenChange={handleOpenChange}>
			<SheetTrigger asChild>
				<Button variant="ghost" size="sm" className="relative">
					<Bell className="h-5 w-5" />
					{unreadCount > 0 && (
						<Badge
							variant="destructive"
							className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
						>
							{unreadCount > 99 ? "99+" : unreadCount}
						</Badge>
					)}
				</Button>
			</SheetTrigger>
			<SheetContent>
				<SheetHeader>
					<SheetTitle>Notifications</SheetTitle>
					<SheetDescription>
						{notifications.length > 0
							? `${notifications.length} notification${notifications.length > 1 ? "s" : ""}`
							: "Aucune notification pour le moment"
						}
					</SheetDescription>
				</SheetHeader>

				<div className="mt-6 space-y-4">
					{notifications.length === 0 ? (
						<div className="text-center py-8 text-gray-500">
							<Bell className="mx-auto h-12 w-12 text-gray-300 mb-4" />
							<p>Aucune notification pour le moment</p>
						</div>
					) : (
						notifications.map((notification) => (
							<div
								key={notification.id}
								className="p-4 rounded-lg border bg-white border-gray-200 hover:bg-gray-50 transition-colors"
							>
								<div className="flex items-start space-x-3">
									<span className="text-lg mt-1">
										{getNotificationIcon(notification.type)}
									</span>
									<div className="flex-1">
										<h4 className="font-medium text-gray-900">
											{notification.title}
										</h4>
										<p className="text-sm mt-1 text-gray-700">
											{notification.message}
										</p>
										<p className="text-xs text-gray-400 mt-2">
											{new Date(notification.createdAt).toLocaleDateString("fr-FR", {
												day: "numeric",
												month: "short",
												hour: "2-digit",
												minute: "2-digit",
											})}
										</p>
									</div>
								</div>
								{notification.actionUrl && (
									<div className="mt-3">
										<Button size="sm" variant="outline" asChild>
											<a href={notification.actionUrl}>
												Voir détails
											</a>
										</Button>
									</div>
								)}
							</div>
						))
					)}
				</div>
			</SheetContent>
		</Sheet>
	);
}