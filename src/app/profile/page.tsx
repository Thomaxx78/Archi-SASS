import { auth } from "~/server/auth";
import { redirect } from "next/navigation";
import Profile from "~/components/05-pages/Profile";

export default async function ProfilePage() {
	const session = await auth();

	if (!session) {
		redirect("/");
	}

	return <Profile session={session} />;
}
