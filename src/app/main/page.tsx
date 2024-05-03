"use client";
import React, { useContext, useEffect, useState } from "react";
import { account, database } from "../appwrite";
import { redirect, useRouter } from "next/navigation";
import UserContext from "@/context/UserContext";
import { Query } from "appwrite";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/custom/ProductCard";

function MainPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [searchString, setSearchString] = useState("");
  const [recentItems, setRecentItems] = useState<any[]>();
  const [randomItems, setRandomItems] = useState<any[]>();

  const fetchRecentProducts = async () => {
    try {
      const response = await database.listDocuments(
        "661c4cf8024705625d40",
        "661c4d0586c78479ef83",
        [Query.limit(5), Query.orderDesc("$createdAt")]
      );
      // console.log(response);
      setRecentItems(response.documents);
    } catch (error) {
      console.error("Error in Recent Products Function", error);
      toast({
        title: "Error in Loading",
        description: "Something went wrong, try again later",
        variant: "destructive",
      });
    }
  };

  const fetchRandomProducts = async () => {
    try {
      const responseForTotal = await database.listDocuments(
        "661c4cf8024705625d40",
        "661c4d0586c78479ef83"
      );
      const randomNum = Math.floor(
        Math.random() * (responseForTotal.total - 5)
      );
      // console.log(randomNum);
      const response = await database.listDocuments(
        "661c4cf8024705625d40",
        "661c4d0586c78479ef83",
        [Query.limit(5), Query.offset(randomNum)]
      );
      // console.log(response.documents);
      setRandomItems(response.documents);
    } catch (error) {
      console.error("Error in random generate funciton", error);
      toast({
        title: "Error in Loading",
        description: "Something went wrong, try again later",
        variant: "destructive",
      });
    }
  };

  const handleSearch = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    const arrayOfString = searchString.toLowerCase().split(" ");
    const stringWithUrl = arrayOfString.join("-");
    router.replace(`/main/search?query=${stringWithUrl}`);
  };

  useEffect(() => {
    fetchRecentProducts();
  }, []);

  useEffect(() => {
    fetchRandomProducts();
  }, []);

  return (
    <>
      <main className="min-h-screen">
        <section
          className="h-72 flex justify-center items-center"
          style={{
            background: "url('/bg.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="bg-secondary flex justify-center flex-col items-center py-6 px-12 gap-3 rounded-md">
            <h3 className="font-bold text-3xl">SELL SOMETHING USELESS</h3>
            <form
              action=""
              className="flex w-full gap-2"
              onSubmit={handleSearch}
            >
              <Input
                className="bg-primary text-background"
                placeholder="Search something useless..."
                onChange={(e) => setSearchString(e.target.value)}
                value={searchString}
              />
              <Button>Search</Button>
            </form>
          </div>
        </section>
        <section className="mt-10 px-5">
          <h2 className="text-2xl font-bold mb-2">
            Featured <span className="">Products</span>
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4 sm:grid-cols-3 lg:grid-cols-5">
            {randomItems &&
              randomItems.map((item, index) => (
                <ProductCard item={item} key={index} />
              ))}
          </div>
        </section>
        <section className="my-8 px-5">
          <h2 className="text-2xl font-bold mb-2">
            Recent <span className="">Products</span>
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4 sm:grid-cols-3 lg:grid-cols-5">
            {recentItems &&
              recentItems.map((item, index) => (
                <ProductCard item={item} key={index} />
              ))}
          </div>
        </section>
      </main>
    </>
  );
}

export default MainPage;
