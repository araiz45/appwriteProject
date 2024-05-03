"use client";
import { database } from "@/app/appwrite";
import ProductCard from "@/components/custom/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Query } from "appwrite";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

function CategoryPage({ params }: { params: { name: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const [totalPage, setTotalPage] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [items, setItems] = useState<any[]>();
  const [searchString, setSearchString] = useState("");
  const handleCategory = async () => {
    // fetch data according to category. with limit of 10.
    try {
      const response = await database.listDocuments(
        "661c4cf8024705625d40",
        "661c4d0586c78479ef83",
        [
          Query.limit(10),
          Query.offset(10 * currentPage),
          Query.equal("category", params.name),
        ]
      );
      console.log(Math.ceil(response.total / 10));
      setTotalPage(Math.ceil(response.total / 10));
      console.log(response);
      setItems(response.documents);
    } catch (error) {
      console.error("Error in handle category", error);
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
    handleCategory();
  }, [params.name]);

  useEffect(() => {
    handleCategory();
    window.scrollTo(0, 0);
  }, [currentPage]);
  return (
    <main className="min-h-screen">
      <section className="mt-10 px-5">
        <div className="">
          <div className="font-bold text-2xl">
            <span className="">Category </span>
            <span className="bg-primary text-background py-1 px-2 rounded-md">
              {params.name[0].toUpperCase() +
                params.name.substring(1).toLowerCase()}
            </span>
          </div>
        </div>
        <div className="bg-secondary h-20 mt-5 flex justify-center items-center rounded-lg">
          <form
            action=""
            className="flex justify-center items-center"
            onSubmit={handleSearch}
          >
            <Input
              type="text"
              onChange={(e) => setSearchString(e.target.value)}
              value={searchString}
              className="bg-background border-2 border-gray-200 w-80 px-2 rounded-r-none py-4"
              placeholder="Search your desired products here"
            />
            <Button className="rounded-l-none" type="submit">
              Search
            </Button>
          </form>
        </div>
      </section>
      <section className="mt-5 px-5">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4 sm:grid-cols-3 lg:grid-cols-5">
          {items?.map((e, key) => (
            <>
              <ProductCard item={e} key={key} />
            </>
          ))}
        </div>
        <div className="flex justify-center items-center gap-2 my-10">
          {Array.from({ length: totalPage }, (_, index) => (
            <Button
              onClick={() => setCurrentPage(index)}
              key={index}
              className="font-bold"
              variant={currentPage === index ? "default" : "secondary"}
              size={"lg"}
            >
              {index + 1}
            </Button>
          ))}
        </div>
      </section>
    </main>
  );
}

export default CategoryPage;

/*
<span className="">
        {Array.from({ length: totalPage }, (_, index) => (
          <div>{index}</div>
        ))}
      </span>


*/
