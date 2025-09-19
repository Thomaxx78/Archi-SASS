import { api } from "~/trpc/react";

export function useEventActions() {
	const utils = api.useUtils();

	const createEvent = api.event.create.useMutation({
		onSuccess: () => {
			// Rafraîchir les événements et les notifications
			void utils.event.getAll.invalidate();
			void utils.notification.getAll.invalidate();
		},
	});

	const updateEventStatus = api.event.updateStatus.useMutation({
		onSuccess: () => {
			// Rafraîchir les événements et les notifications
			void utils.event.getAll.invalidate();
			void utils.notification.getAll.invalidate();
		},
	});

	const updateEvent = api.event.update.useMutation({
		onSuccess: () => {
			// Rafraîchir les événements
			void utils.event.getAll.invalidate();
		},
	});

	return {
		createEvent,
		updateEventStatus,
		updateEvent,
	};
}