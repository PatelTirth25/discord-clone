import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { db } from "./db";
import { redirect } from "next/navigation";

const profile = async () => {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user) {
        return redirect('/signup')
    }

    const profile = await db.profile.findFirst({
        where: {
            userId: user.id
        }
    })

    if (profile) {
        return profile;
    }

    let profilePic: string = "https://imgs.search.brave.com/9Wxx5Gi8I8l96Zgq67qBAkrWDBGC_GVsY0dUXOKz26w/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTMz/NzE0NDE0Ni92ZWN0/b3IvZGVmYXVsdC1h/dmF0YXItcHJvZmls/ZS1pY29uLXZlY3Rv/ci5qcGc_cz02MTJ4/NjEyJnc9MCZrPTIw/JmM9QkliRnd1djdG/eFRXdmg1UzN2QjZi/a1QwUXY4Vm44TjVG/ZnNlcTg0Q2xHST0"
    let newProfile;

    if (!user.picture || user.picture === "") {
        newProfile = await db.profile.create({
            data: {
                userId: user.id,
                name: `${user.given_name} ${user.family_name}`,
                imgUrl: profilePic,
                email: user.email
            }
        })
    }
    else {
        newProfile = await db.profile.create({
            data: {
                userId: user.id,
                name: `${user.given_name} ${user.family_name}`,
                imgUrl: user.picture,
                email: user.email
            }
        })
    }

    return newProfile
}

export default profile

