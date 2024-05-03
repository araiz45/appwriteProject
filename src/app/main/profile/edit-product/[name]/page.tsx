"use client";
import React, { useEffect, useState } from "react";
import { database } from "@/app/appwrite";
import { Query } from "appwrite";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MdDelete } from "react-icons/md";
import { Textarea } from "@/components/ui/textarea";
import { ID, storage } from "@/app/appwrite";
import Image from "next/image";
import UserContext from "@/context/UserContext";
import Link from "next/link";
import { Switch } from "@/components/ui/switch";

function Editpage({ params }: { params: { name: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState<string>("0");
  const [fromWhereToBuy, setFromWhereToBuy] = useState("");
  const [features, setFeatures] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [category, setCategory] = useState("laptop");
  const [sellerId, setSellerId] = useState("");
  const [sellerEmail, setSellerEmail] = useState("");
  const [sellerName, setSellerName] = useState("");
  const [isSold, setIsSold] = useState<boolean>();
  const [slug, setSlug] = useState("");
  const [documentId, setDocumentId] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [image, setImage] = useState<any>();

  async function handleSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const data = {
      title,
      price,
      "from-where-to-buy": fromWhereToBuy,
      features,
      whatsapp,
      category,
      "seller-id": sellerId,
      "seller-email": sellerEmail,
      "seller-name": sellerName,
      "is-sold": isSold,
      images: images,
    };
    try {
      const response = await database.updateDocument(
        "661c4cf8024705625d40",
        "661c4d0586c78479ef83",
        documentId,
        data
      );
      console.log(response);
      toast({
        title: "Entry has been updated",
      });
      console.log(images);
      router.replace("/main/profile");
    } catch (error) {
      console.error("Error in update.", error);
      toast({
        title: "Entry has been updated",
        variant: "destructive",
      });
    }
  }
  useEffect(() => {
    const handleParam: any = async () => {
      try {
        const response = await database.listDocuments(
          "661c4cf8024705625d40",
          "661c4d0586c78479ef83",
          [Query.equal("slug", params.name)]
        );
        console.log(response.documents[0]);
        const data = response.documents[0];
        setTitle(data.title);
        setPrice(data.price);
        setFeatures(data.features);
        setFromWhereToBuy(data["from-where-to-buy"]);
        setWhatsapp(data.whatsapp);
        setCategory(data.category);
        setSellerId(data["seller-id"]);
        setSellerEmail(data["seller-email"]);
        setSellerName(data["seller-name"]);
        setIsSold(data["is-sold"]);
        setImages(data["images"]);
        setDocumentId(data.$id);
      } catch (error) {
        console.error("Error in getting.", error);
        toast({
          title: "Something went wrong",
          variant: "destructive",
        });
      }
    };
    handleParam();
  }, []);

  async function handlePhoto(ev: React.MouseEvent<HTMLButtonElement>) {
    ev.preventDefault();

    console.log(image.type);

    if (
      image.type === "image/png" ||
      image.type === "image/jpeg" ||
      image.type === "image/jpg"
    ) {
      console.log("done");
      try {
        const promise = await storage.createFile(
          process.env.IMAGES_BUCKET_ID || "661c531f796e795dcb47",
          ID.unique(),
          image
        );
        console.log(promise);
        const getPreview = await storage.getFilePreview(
          process.env.IMAGES_BUCKET_ID || "661c531f796e795dcb47",
          promise.$id
        );
        console.log(getPreview.href);
        // setPhotosArray((ev) => [...ev, getPreview.href]);
        setImages((e) => [...e, getPreview.href]);
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
    const ArrayAfterDelete = images.filter((item) => item !== value);
    setImages(ArrayAfterDelete);
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
        <div className="my-5 space-x-2 flex items-center">
          <label className="text-sm font-bold">Is Sold</label>
          <Switch
            onClick={() => setIsSold(!isSold)}
            checked={isSold ? true : false}
          />
        </div>
        <div className="my-5">
          <label className="text-sm font-bold">From Where to Buy</label>
          <Input
            required
            className="border-[1px] border-gray-100 bg-secondary mt-2"
            placeholder="ABC Street, XYZ City, Pakistan"
            onChange={(e) => setFromWhereToBuy(e.target.value)}
            value={fromWhereToBuy}
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
              onChange={(ev) =>
                ev.target?.files && setImage(ev.target.files[0])
              }
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
          {images.length !== 0 ? (
            images.map((e, index) => (
              <div
                className="w-36 h-36 relative rounded-lg overflow-hidden"
                key={index}
              >
                <Image
                  src={e}
                  fill
                  style={{ objectFit: "cover" }}
                  alt="hello"
                  sizes={"33"}
                />
                <div
                  className="relative z-10 bg-rose-700 rounded-full my-1 mx-1 cursor-pointer w-6 h-6 flex justify-center items-center"
                  onClick={() => deleteEntity(e)}
                >
                  <MdDelete />
                </div>
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
            <Button type="button" variant={"secondary"}>
              Discard
            </Button>
          </Link>
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </main>
  );
}

export default Editpage;
