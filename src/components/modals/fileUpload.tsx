"use client"
import Image from "next/image";
import { FileIcon, X } from "lucide-react";
import { UploadDropzone } from "@/lib/uploadthing"
import "@uploadthing/react/styles.css";

interface fileUploadProps {
    onChange: (url?: string) => void
    value: string
    endpoint: "imageUploader" | "messageFile"
}

const fileUpload = ({ onChange, value, endpoint }: fileUploadProps) => {
    const fileType = value?.split(".")?.[value.split(".").length - 1]

    if (value && fileType !== "pdf") {
        return (
            <div className="relative w-[100px] h-[100px] text-center flex justify-center">
                <Image
                    src={value}
                    alt="Uploaded image"
                    width={100}
                    height={100}
                    className="rounded-[50%] border-white border"
                />
                <button className="bg-rose-600  rounded-full absolute top-0 right-0" onClick={() => onChange("")}>
                    <X />
                </button>
            </div>
        )
    }

    if (value && fileType == 'pdf') {
        return (
            <div className="relative flex items-center p-1 mt-1">
                <FileIcon className="w-8 h-8" />
                <a href={value} target="_blank" rel="noreferrer noopener" className="mx-4 text-sm">{value}</a>
                <button className="bg-rose-600  rounded-full absolute -top-2 -right-1" onClick={() => onChange("")}>
                    <X />
                </button>
            </div>
        )
    }
    return (
        <UploadDropzone
            endpoint={endpoint}
            onClientUploadComplete={(res) => onChange(res?.[0].url)}
            onUploadError={(error) => {
                console.log("Error: ", error)
                alert("Upload Error")
            }}
        />
    )
}

export default fileUpload
