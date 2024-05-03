import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { VscKebabVertical } from "react-icons/vsc";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TiThMenu } from "react-icons/ti";
import Link from "next/link";
import { Button } from "../ui/button";
import { IoMdClose } from "react-icons/io";

type itemsProp = {
  item: any;
  deleteProduct?(id: string): void;
  crossProduct?(id: string): void;
  id?: string;
};

function ProductCard({ item, deleteProduct, crossProduct, id }: itemsProp) {
  return (
    <Card className="bg-secondary">
      <CardHeader>
        <Image
          src={item && item.images[0]}
          width={540}
          height={540}
          alt="title"
        />
        <CardDescription>
          {(() => item.category.replace(/-/g, " "))()}
        </CardDescription>
        <CardTitle className="flex justify-between items-center">
          <Link href={"/main/product/" + item.$id}>
            {item.title[0].toUpperCase() + item.title.substring(1, 20)}
          </Link>
          {deleteProduct ? (
            <>
              <span className="">
                <Menubar>
                  <MenubarMenu>
                    <MenubarTrigger>
                      <VscKebabVertical />
                    </MenubarTrigger>
                    <MenubarContent>
                      <Link href={"/main/product/" + item.$id}>
                        <MenubarItem>Preview</MenubarItem>
                      </Link>
                      <Link href={"/main/profile/edit-product/" + item.slug}>
                        <MenubarItem>Edit</MenubarItem>
                      </Link>
                      <MenubarSeparator />
                      <MenubarItem
                        className=" bg-red-700 focus:bg-red-400 focus:text-red-700"
                        onClick={() => deleteProduct(item.$id)}
                      >
                        Delete
                      </MenubarItem>
                    </MenubarContent>
                  </MenubarMenu>
                </Menubar>
              </span>
            </>
          ) : (
            ""
          )}
          {crossProduct ? (
            <>
              <div className="">
                <Button
                  variant={"destructive"}
                  size={"sm"}
                  onClick={() => crossProduct(id || "")}
                >
                  <IoMdClose />
                </Button>
              </div>
            </>
          ) : (
            ""
          )}
        </CardTitle>
        <CardDescription className="my-2 text-xl font-bold">
          ${item.price}
        </CardDescription>
        <CardDescription className="">
          {!item["is-sold"] ? (
            <span className="bg-green-200 text-green-900 py-1 px-2 text-xs rounded-full">
              Available
            </span>
          ) : (
            <span className="bg-red-200 text-red-900 py-1 px-2 text-xs rounded-full">
              Sold Out
            </span>
          )}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}

export default ProductCard;
