"use client";
import Navbar from "@/components/custom/Navbar";
import React, { useEffect, useState } from "react";
import { account } from "../appwrite";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import UserProvider from "@/context/UserContext";
import Image from "next/image";
import Footer from "@/components/custom/Footer";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loggedInUser, setLoggedInUser] = useState<any>();
  const { toast } = useToast();
  // check user

  const checkUser = async () => {
    try {
      const session = await account.get();
      setLoggedInUser(session);
      console.log(session); // NOTE : Remove this
    } catch (error) {
      console.error("Error in validating users", error);
      console.log(error);
      router.push("/login");
      toast({
        title: "Error",
        description: "In Loading Profile ",
      });
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  return loggedInUser === null ? (
    router.push("/login")
  ) : (
    <>
      {!loggedInUser ? (
        <section className="min-h-screen flex justify-center items-center">
          <Image src={"/loading.gif"} width={30} height={30} alt="loading" />
        </section>
      ) : (
        <UserProvider.Provider value={loggedInUser}>
          <section>
            <Navbar />
            {children}
            <Footer />
          </section>
        </UserProvider.Provider>
      )}
    </>
  );
}
