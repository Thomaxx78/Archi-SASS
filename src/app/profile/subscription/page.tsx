import { auth } from "~/server/auth";
import { api } from "~/trpc/server";
import Subscription from "~/components/05-pages/Subscription";

export default async function SubscriptionPage() {
	const session = await auth();

	if (!session) {
		throw new Error("Session non trouvée");
	}

	const profile = await api.user.getProfile();

	return <Subscription session={session} profile={profile} mounted={true} />;
}
