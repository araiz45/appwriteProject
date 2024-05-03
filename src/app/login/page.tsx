"use client";

import Image from "next/image";
import { FaGithub } from "react-icons/fa";
import { FaGoogle } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@radix-ui/react-separator";
import Link from "next/link";
import { ID, account } from "@/app/appwrite";
import { useToast } from "@/components/ui/use-toast";
import { redirect, useRouter } from "next/navigation";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();
  const router = useRouter();
  const [loggedInUser, setLoggedInUser] = useState<any>();

  const handleLogin = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    try {
      const session = await account.createEmailSession(email, password);
      // for update phone number.
      // await account.updatePhone("+923350234993", password);
      setLoggedInUser(await account.get());
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Invalid Username or password",
      });
    }
  };
  const registerWithGoogle = async () => {
    try {
      account.createOAuth2Session(
        "google",
        "https://appwrite-project-zeta.vercel.app/main", // Success URL
        "https://appwrite-project-zeta.vercel.app/" // Failure URL
      );
    } catch (error) {
      console.error("Error in Authenticating", error);
      toast({
        title: "Error",
        description: "In Loading",
      });
    }
  };
  const registerWithGitHub = async () => {
    try {
      account.createOAuth2Session(
        "github",
        "https://appwrite-project-zeta.vercel.app/main", // Success URL
        "https://appwrite-project-zeta.vercel.app/" // Failure URL
      );
    } catch (error) {
      console.error("Error in Authenticating");
    }
  };
  const checkUser = async () => {
    try {
      const session = await account.get();
      setLoggedInUser(session);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkUser();
  }, []);
  return loggedInUser ? (
    redirect("/main")
  ) : (
    <main className="flex min-h-screen w-full justify-center items-center">
      <div className="bg-primary w-[25rem] p-8 text-secondary rounded-md">
        <form
          action=""
          className="flex flex-col gap-3 my-2 "
          onSubmit={handleLogin}
        >
          <div className="">
            <label htmlFor="" className="text-secondary text-sm">
              Enter Email
            </label>
            <Input
              type="email"
              onChange={(ev) => setEmail(ev.target.value)}
              value={email}
            />
          </div>
          <div className="">
            <label htmlFor="" className="text-secondary text-sm">
              Enter Password
            </label>
            <Input
              type="password"
              onChange={(ev) => setPassword(ev.target.value)}
              value={password}
            />
          </div>
          <Button variant={"secondary"} type="submit">
            Login
          </Button>
        </form>
        <div className="flex flex-col gap-1">
          <span className="h-[1px] bg-secondary my-3"></span>

          <Button variant={"secondary"} onClick={() => registerWithGoogle()}>
            <FaGoogle /> <span className="ml-2">Login with Google</span>
          </Button>
          <Button variant={"secondary"}>
            {" "}
            <FaGithub />{" "}
            <span className="ml-2" onClick={() => registerWithGitHub()}>
              Login with Github
            </span>
          </Button>
          <span className="h-[1px] bg-secondary my-3"></span>
          <p className="text-sm">
            Don&apos;t have an account?{" "}
            <Link href={"/register"} className="italic underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

export default LoginPage;
