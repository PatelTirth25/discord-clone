import Profile from "@/lib/profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import CreateServer from "@/components/modals/createServer";

export default async function Home() {

  const userProfile = await Profile();

  const server = await db.server.findFirst({
    where: {
      member: {
        some: {
          profileId: userProfile.id
        }
      }
    }
  })
  if (server) {
    return redirect(`/server/${server.id}`)
  }

  return (
    <CreateServer />
  );
}
