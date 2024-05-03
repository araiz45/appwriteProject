"use client";
import React, { useContext } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import UserContext from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { account } from "@/app/appwrite";
import { useRouter } from "next/navigation";

function Profile() {
  const user: any = useContext(UserContext);
  const router = useRouter();

  const logout = async () => {
    try {
      await account.deleteSession("current");
      router.push("/login");
    } catch (error) {
      console.error("Error in logout", error);
    }
  };
  return (
    <section className="flex justify-center flex-col items-center mb-11 mt-5">
      <Avatar className="w-[5rem] h-[5rem]">
        <AvatarFallback className="bg-primary text-4xl text-background font-bold">
          {user.name[0]}
        </AvatarFallback>
      </Avatar>
      <h1 className="text-3xl font-bold mt-2">{user.name}</h1>
      <h4
        className="text-sm mb-6 text-gray-400 cursor-pointer"
        onClick={() => navigator.clipboard.writeText(user.email)}
      >
        {user.email}
      </h4>
      <Button size={"sm"} onClick={logout} variant={"outline"}>
        Logout
      </Button>
    </section>
  );
}

export default Profile;
