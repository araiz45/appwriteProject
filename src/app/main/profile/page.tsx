"use client";
import React, { useContext, useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserContext from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import Profile from "@/components/custom/Profile";
import { database } from "@/app/appwrite";
import { Query } from "appwrite";
import Link from "next/link";

import ProductCard from "@/components/custom/ProductCard";
import { useToast } from "@/components/ui/use-toast";

// TODO: Shift integrate handleRequest and make card.
function SellerAccount() {
  const [items, setItems] = useState<any[]>([]);
  const [wishItems, setWishItems] = useState<any[]>([]);
  const user: any = useContext(UserContext);
  const { toast } = useToast();
  const handleRequest = async () => {
    try {
      const { documents } = await database.listDocuments(
        process.env.DATABASE_ID || "661c4cf8024705625d40",
        process.env.ITEMS_COLLECTION_ID || "661c4d0586c78479ef83",
        [Query.equal("seller-id", [user.$id])]
      );
      console.log(documents);
      setItems(documents);
    } catch (error) {
      console.error("Error in loading entities: ", error);
    }
  };

  async function deleteProduct(id: string) {
    const prompt = window.confirm("Do you want to delete this product");
    if (prompt) {
      try {
        const documents = await database.deleteDocument(
          process.env.DATABASE_ID || "661c4cf8024705625d40",
          process.env.ITEMS_COLLECTION_ID || "661c4d0586c78479ef83",
          id
        );
        console.log(documents);
        handleRequest();
      } catch (error) {
        console.error("Error in deleting  entities: ", error);
      }
    }
  }

  const handleWishList = async () => {
    try {
      const response = await database.listDocuments(
        "661c4cf8024705625d40",
        "663171ae00312476626d",
        [Query.equal("UserId", [user.$id])]
      );

      console.log(response);
      setWishItems(response.documents);
    } catch (error) {
      toast({
        title: "Unable to fetch wishlist",
        variant: "destructive",
      });
    }
  };
  const deleteWishedProduct = async (id: string) => {
    try {
      const response = await database.deleteDocument(
        "661c4cf8024705625d40",
        "663171ae00312476626d",
        id
      );
      console.log(response);
      toast({
        title: "Delete has been successfull",
        description: "",
        variant: "default",
      });
      handleWishList();
    } catch (error) {
      console.error("error in remove wish item", error);
      toast({
        title: "Error in Removing",
        description: "Unable to remove wish item",
        variant: "destructive",
      });
    }
  };
  useEffect(() => {
    handleRequest();
  }, []);

  useEffect(() => {
    handleWishList();
  }, []);
  return (
    <main className="min-h-screen flex flex-col justify-start items-center">
      <Profile />
      <section className="">
        <Tabs defaultValue="products" className="w-[33rem]">
          <TabsList className="w-[33rem]">
            <TabsTrigger value="products" className="w-[16.5rem]">
              My Products
            </TabsTrigger>
            <TabsTrigger value="wish-list" className="w-[16.5rem]">
              Wish list
            </TabsTrigger>
          </TabsList>
          <TabsContent value="products">
            <div className="grid grid-cols-2 gap-3 my-7 ">
              {items.length !== 0 ? (
                items.map((item, index) => (
                  <ProductCard
                    item={item}
                    deleteProduct={deleteProduct}
                    key={index}
                  />
                ))
              ) : (
                <span className="text-center">No Item to show</span>
              )}
            </div>
          </TabsContent>
          <TabsContent value="wish-list">
            <div className="grid grid-cols-2 gap-3 my-7 ">
              {wishItems.length !== 0 ? (
                wishItems.map((item, index) => (
                  <ProductCard
                    key={index}
                    item={item.Product}
                    id={item.$id}
                    crossProduct={deleteWishedProduct}
                  />
                ))
              ) : (
                <span className="text-center">No Item to show</span>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </section>
      <section className="mb-6">
        <Link href="/main/profile/add-product">
          <Button>Add Product</Button>
        </Link>
      </section>
    </main>
  );
}

export default SellerAccount;
