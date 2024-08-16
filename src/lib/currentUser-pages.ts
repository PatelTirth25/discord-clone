import {
    getKindeServerSession,
} from "@kinde-oss/kinde-auth-nextjs/server";
import { db } from "./db";
import { NextApiRequest } from "next";

const CurrentUserPages = async (req: NextApiRequest) => {

    const { getUser } = getKindeServerSession(req);
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

export default CurrentUserPages
