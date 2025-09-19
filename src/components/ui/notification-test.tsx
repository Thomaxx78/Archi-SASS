"use client";

import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";

export function NotificationTest() {
	const createNotificationMutation = api.notification.create.useMutation();
	const utils = api.useUtils();

	const createTestNotification = async (type: "INFO" | "SUCCESS" | "WARNING" | "ERROR" | "EVENT_INVITATION" | "EVENT_UPDATE" | "SUBSCRIPTION_UPDATE") => {
		const notifications = {
			INFO: {
				title: "Information",
				message: "Ceci est une notification d'information",
			},
			SUCCESS: {
				title: "Succès",
				message: "Votre action a été effectuée avec succès",
			},
			WARNING: {
				title: "Attention",
				message: "Quelque chose nécessite votre attention",
			},
			ERROR: {
				title: "Erreur",
				message: "Une erreur s'est produite",
			},
			EVENT_INVITATION: {
				title: "Nouvelle invitation",
				message: "Vous avez été invité à un événement",
				actionUrl: "/events",
			},
			EVENT_UPDATE: {
				title: "Événement modifié",
				message: "Un événement auquel vous participez a été modifié",
			},
			SUBSCRIPTION_UPDATE: {
				title: "Abonnement mis à jour",
				message: "Votre abonnement a été modifié",
				actionUrl: "/profile/subscription",
			},
		};

		try {
			await createNotificationMutation.mutateAsync({
				type,
				...notifications[type],
			});

			// Rafraîchir les notifications
			await utils.notification.getAll.invalidate();
		} catch (error) {
			console.error("Erreur lors de la création de la notification:", error);
		}
	};

	return (
		<div className="p-6 bg-white rounded-lg border">
			<h3 className="text-lg font-semibold mb-4">Test des notifications</h3>
			<div className="grid grid-cols-2 gap-3">
				<Button
					onClick={() => createTestNotification("INFO")}
					variant="outline"
					disabled={createNotificationMutation.isPending}
				>
					Test Info
				</Button>
				<Button
					onClick={() => createTestNotification("SUCCESS")}
					variant="outline"
					disabled={createNotificationMutation.isPending}
				>
					Test Succès
				</Button>
				<Button
					onClick={() => createTestNotification("WARNING")}
					variant="outline"
					disabled={createNotificationMutation.isPending}
				>
					Test Attention
				</Button>
				<Button
					onClick={() => createTestNotification("ERROR")}
					variant="outline"
					disabled={createNotificationMutation.isPending}
				>
					Test Erreur
				</Button>
				<Button
					onClick={() => createTestNotification("EVENT_INVITATION")}
					variant="outline"
					disabled={createNotificationMutation.isPending}
				>
					Test Invitation
				</Button>
				<Button
					onClick={() => createTestNotification("SUBSCRIPTION_UPDATE")}
					variant="outline"
					disabled={createNotificationMutation.isPending}
				>
					Test Abonnement
				</Button>
			</div>
		</div>
	);
}