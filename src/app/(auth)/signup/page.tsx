"use client"
import React from 'react'
import { RegisterLink, LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";

const Page = () => {

    return (
        <div>
            <LoginLink postLoginRedirectURL="/">Sign in</LoginLink>
            <br />
            <RegisterLink postLoginRedirectURL="/">Sign up</RegisterLink>
        </div>
    )
}

export default Page
