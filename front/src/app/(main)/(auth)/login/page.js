"use client";
import React from "react";
import { useRouter } from "next/navigation";
import LoginForm from "./_components/LoginForm";
import Link from "next/link";

function Page() {
  const router = useRouter();

  return (
    <div  >

        <LoginForm />

    </div>
  );
}

export default Page;
