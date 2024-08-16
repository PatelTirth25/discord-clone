import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

const handleAuth = async () => {

    const { getUser } = getKindeServerSession();
    const user = await getUser();
    if (!user) {
        throw new UploadThingError("Unauthorized");
    }
    return { userId: user.id }
}

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
    // Define as many FileRoutes as you like, each with a unique routeSlug
    imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
        .middleware(async () => {
            const user = await handleAuth();
            return { userId: user };
        })
        .onUploadComplete(() => { }),
    messageFile: f(["image", "pdf"])
        .middleware(async () => {
            const user = await handleAuth();
            return { userId: user };
        })
        .onUploadComplete(() => { }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
