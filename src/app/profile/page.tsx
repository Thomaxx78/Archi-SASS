import { auth } from "~/server/auth";
import Profile from "~/components/05-pages/Profile";

export default async function ProfilePage() {
	const session = await auth();

	if (!session) {
		throw new Error("Session non trouvée");
	}

	return <Profile session={session} />;
}
