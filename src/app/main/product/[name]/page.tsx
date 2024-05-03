"use client";
import { database } from "@/app/appwrite";
import { useToast } from "@/components/ui/use-toast";
import UserContext from "@/context/UserContext";
import { ID, Query } from "appwrite";
import { FaUser } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FaPhoneAlt } from "react-icons/fa";
import { FaShoppingBag } from "react-icons/fa";
import { IoLogoWhatsapp } from "react-icons/io";

import React, { useContext, useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import { BiCategory, BiHeart } from "react-icons/bi";
import { FaRegIdCard } from "react-icons/fa6";

import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { MdOutlineEventAvailable } from "react-icons/md";
import ProductCard from "@/components/custom/ProductCard";
import { Button } from "@/components/ui/button";

function ProductPage({ params }: { params: { name: string } }) {
  const [docuement, setDocument] = useState<any>();
  const [posts, setPosts] = useState<any[]>([]);
  const { toast } = useToast();
  const user: any = useContext(UserContext);

  useEffect(() => {
    (async () => {
      // fetch entry by url
      try {
        const response = await database.getDocument(
          "661c4cf8024705625d40",
          "661c4d0586c78479ef83",
          params.name
        );

        setDocument(response);
        console.log(response); // TODO: Remove this console log
      } catch (error) {
        console.error("Error in product/name page. ", error);
        toast({
          title: "Something went wrong",
          description: "Error in Loading...",
          variant: "destructive",
        });
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      // fetch three posts
      try {
        const response = await database.listDocuments(
          "661c4cf8024705625d40",
          "661c4d0586c78479ef83",
          [Query.limit(3)]
        );
        setPosts(response.documents);
      } catch (error) {
        console.error("Fetching Posts", error);
        toast({
          title: "Something went wrong",
          description: "Error in Loading...",
          variant: "destructive",
        });
      }
    })();
  }, []);

  // Untested Function
  // TODO: test it.
  const addToWishList = async () => {
    // add to wish list
    if (user.$id !== docuement["seller-id"]) {
      try {
        const response = await database.createDocument(
          "661c4cf8024705625d40",
          "663171ae00312476626d",
          ID.unique(),
          {
            UserId: user.$id,
            Product: docuement.$id,
          }
        );
        console.log(response); // TODO: Remove this console log
        toast({
          title: "Product has been added to wishlist",
          description: "",
          variant: "default",
        });
      } catch (error) {
        console.error("Error in adding product to wish list.", error);
        toast({
          title: "Something went wrong",
          description: "Adding to wish list.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Forbidden",
        description: "You are the seller of this product",
        variant: "default",
      });
    }
  };

  return (
    <>
      {docuement && (
        <main className="px-10 lg:px-28 xl:px-28">
          <section className="px-10 py-6 rounded-lg my-6 bg-secondary min-h-screen lg:px-20 xl:px-20">
            <div className="">
              <Carousel>
                <CarouselContent>
                  {docuement?.images.map((e: string, index: number) => (
                    <CarouselItem className="" key={"cart" + index + 1}>
                      <div
                        className="min-h-96 rounded-md"
                        style={{
                          background: `url("${e}")`,
                          backgroundRepeat: "no-repeat",
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      ></div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>

            <div className="">
              <h1 className="font-bold text-3xl mt-10">{docuement.title}</h1>
              <div className="flex mt-4 gap-4">
                <div className="bg-primary text-background flex flex-col font-semibold text-xl w-64 min-h-32 justify-center gap-3 py-2 px-4 rounded-md max-sm:py-1">
                  <div className="flex items-center">
                    <RiMoneyDollarCircleLine size={30} />
                    <span className="">{docuement.price}</span>
                  </div>
                  <div className="flex items-center">
                    <BiCategory size={30} />
                    <span className="">
                      {docuement.category[0].toUpperCase() +
                        docuement.category.substring(1).toLowerCase()}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="flex items-center gap-5">
                      <div className="">
                        {!docuement["is-sold"] ? (
                          <span className="bg-green-400 text-green-800 px-2 py-1 rounded-full text-sm">
                            Available
                          </span>
                        ) : (
                          <span className="bg-red-400 text-red-800 px-4 py-2 rounded-full">
                            Sold out
                          </span>
                        )}
                      </div>
                      <div className="">
                        <Button
                          variant={"secondary"}
                          size={"sm"}
                          onClick={() => addToWishList()}
                        >
                          <BiHeart size={18} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="min-h-32 bg-primary w-full text-background rounded-md py-2 px-4">
                  <h2 className="flex items-center gap-1 font-bold text-lg max-sm:text-md">
                    <FaUser /> <span>Seller Information</span>
                  </h2>
                  <div className="mt-2 max-sm:text-sm">
                    <div className="flex items-center gap-1 font-semibold">
                      <FaRegIdCard />
                      <span className="">{docuement["seller-name"]}</span>
                    </div>
                    <div className="flex items-center gap-1 font-semibold">
                      <MdEmail />
                      <span className="">{docuement["seller-email"]}</span>
                    </div>
                    <div className="flex items-center gap-1 font-semibold">
                      <IoLogoWhatsapp />
                      <span className="">{docuement["whatsapp"]}</span>
                    </div>
                    <div className="flex items-center gap-1 font-semibold">
                      <FaShoppingBag />
                      <span className="">{docuement["from-where-to-buy"]}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-8 ">
                <h2 className="font-bold text-xl">Description</h2>
                <p className=" text-gray-300 text-[16px]">
                  {docuement.features}
                </p>
              </div>
            </div>
          </section>
          <section className="flex gap-3 my-8 ">
            {posts.map((e, index) => (
              <ProductCard key={index} item={e} />
            ))}
          </section>
        </main>
      )}
    </>
  );
}

export default ProductPage;
