import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { db } from "./db";

const CurrentUser = async () => {

    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user) {
        return null
    }

    const profile = await db.profile.findFirst({
        where: {
            userId: user?.id
        }
    })

    return profile

}

export default CurrentUser
