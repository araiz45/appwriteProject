"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { MdDelete } from "react-icons/md";

import React, { useContext, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { ID, database, storage } from "@/app/appwrite";
import Image from "next/image";
import UserContext from "@/context/UserContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

const ProductPage: React.FC = () => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [whereToBuy, setWhereToBuy] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [photosArray, setPhotosArray] = useState<string[]>([]);
  const [features, setFeatures] = useState("");
  const [pic, setPic] = useState<any>();

  const user: any = useContext(UserContext);
  const router = useRouter();

  async function handleSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const slug = generateSlug(title);
    try {
      const response = await database.createDocument(
        process.env.DATABASE_ID || "661c4cf8024705625d40",
        process.env.ITEMS_COLLECTION_ID || "661c4d0586c78479ef83",
        ID.unique(),
        {
          title,
          price: parseFloat(price),
          "from-where-to-buy": whereToBuy,
          features,
          whatsapp,
          category,
          "seller-id": user.$id,
          "seller-name": user.name,
          "seller-email": user.email,
          "is-sold": false,
          slug,
          images: photosArray,
        }
      );
      console.log(response); // TODO: Remove this
      router.push("/main/profile");
    } catch (error) {
      console.error("error in handleSubmit", error);
    }
  }

  async function handlePhoto(ev: React.MouseEvent<HTMLButtonElement>) {
    ev.preventDefault();

    console.log(pic.type);

    if (
      pic.type === "image/png" ||
      pic.type === "image/jpeg" ||
      pic.type === "image/jpg"
    ) {
      console.log("done");
      try {
        const promise = await storage.createFile(
          process.env.IMAGES_BUCKET_ID || "661c531f796e795dcb47",
          ID.unique(),
          pic
        );
        console.log(promise);
        const getPreview = await storage.getFilePreview(
          process.env.IMAGES_BUCKET_ID || "661c531f796e795dcb47",
          promise.$id
        );
        console.log(getPreview.href);
        // setPhotosArray((ev) => [...ev, getPreview.href]);
        setPhotosArray((e) => [...e, getPreview.href]);
      } catch (error) {
        toast({
          title: "Something went wrong while uploading file",
        });
      }
    } else {
      toast({
        title: "Invalid File type",
      });
    }
  }

  const deleteEntity = (value: string) => {
    const ArrayAfterDelete = photosArray.filter((item) => item !== value);
    setPhotosArray([]);
    setPhotosArray(ArrayAfterDelete);
  };
  return (
    <main className="">
      <form className="px-36 my-10" onSubmit={handleSubmit}>
        <div className="my-5">
          <label className="text-sm font-bold">Enter Your Title</label>
          <Input
            required
            className="border-[1px] border-gray-100 bg-secondary mt-2"
            placeholder="your title here"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="flex w-full items-end gap-2 my-5">
          <div className="w-full">
            <label className="text-sm font-bold">Set your price</label>
            <Input
              required
              className="border-[1px] border-gray-100 bg-secondary mt-2"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              type={"number"}
              placeholder="$44"
            />
          </div>
          <div className="w-full">
            <label className="text-sm font-bold">
              Select your product category
            </label>
            <Select value={category} onValueChange={(e) => setCategory(e)}>
              <SelectTrigger className="w-full bg-secondary border-[1px]  border-gray-100 mt-2">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mobile">Mobile</SelectItem>
                <SelectItem value="computer">Computer</SelectItem>
                <SelectItem value="laptop">Laptop</SelectItem>
                <SelectItem value="desktop">Desktop</SelectItem>
                <SelectItem value="electronic-assessories">
                  Electronic Assessoires
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="my-5">
          <label className="text-sm font-bold">From Where to Buy</label>
          <Input
            required
            className="border-[1px] border-gray-100 bg-secondary mt-2"
            placeholder="ABC Street, XYZ City, Pakistan"
            onChange={(e) => setWhereToBuy(e.target.value)}
          />
        </div>
        <div className="my-5">
          <label className="text-sm font-bold">
            Enter Your Whatsapp Number
          </label>
          <Input
            required
            maxLength={13}
            value={whatsapp}
            onChange={(ev) => setWhatsapp(ev.target.value)}
            className="border-[1px] border-gray-100 bg-secondary mt-2"
            placeholder="your title here"
          />
        </div>
        <div className="flex items-end w-full gap-2 my-5">
          <div className="w-full">
            <label className="text-sm font-bold">Upload Photos</label>
            <Input
              type="file"
              onChange={(ev) => ev.target?.files && setPic(ev.target.files[0])}
              className="border-[1px] border-gray-100 bg-secondary mt-2"
              placeholder="your title here"
            />
          </div>
          <Button
            variant={"secondary"}
            className="border-[1px] border-gray-100"
            onClick={handlePhoto}
          >
            Upload
          </Button>
        </div>
        <div className="flex gap-4">
          {photosArray.length !== 0 ? (
            photosArray.map((e, index) => (
              <div
                className="w-36 h-36 relative rounded-lg overflow-hidden"
                key={index}
              >
                <Image
                  src={e}
                  fill
                  style={{ objectFit: "cover" }}
                  alt="hello"
                />
                <Button
                  className="relative z-10"
                  variant={"destructive"}
                  onClick={() => deleteEntity(e)}
                  size={"sm"}
                >
                  <MdDelete />
                </Button>
              </div>
            ))
          ) : (
            <></>
          )}
        </div>
        <div className="my-5">
          <label className="text-sm font-bold">Features</label>
          <Textarea
            onChange={(ev) => setFeatures(ev.target.value)}
            value={features}
            className="border-[1px] border-gray-100 bg-secondary min-h-36 mt-2"
            required
            placeholder="your title here"
          />
        </div>
        <div className="flex items-end justify-end gap-2">
          <Link href="/main/profile">
            <Button type="submit" variant={"secondary"}>
              Discard
            </Button>
          </Link>
          <Button type="submit">Save</Button>
        </div>
      </form>
    </main>
  );
};

export default ProductPage;

const generateSlug = (title: string): string => {
  let hyphenatedString = title.replace(/\s+/g, "-");
  let lowerString = hyphenatedString.toLowerCase();
  let dateNow = Date.now();
  let finalString = lowerString + "-" + dateNow.toString();
  return finalString;
};
