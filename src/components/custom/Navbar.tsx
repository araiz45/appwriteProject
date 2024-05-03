"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import UserContext from "@/context/UserContext";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { FaHeart } from "react-icons/fa";

export default function Navbar() {
  const router = useRouter();
  const user: any = useContext(UserContext);
  const [fallback, setFallback] = useState(user.name[0]);

  return (
    <nav className="bg-secondary text-primary flex items-center justify-between py-2 px-4">
      <Link href={"/main"} className="text-xl font-bold">
        Falto
      </Link>
      <div className="flex justify-center items-center gap-3">
        <Select
          onValueChange={(ev) => {
            router.push("/main/category/" + ev || "/");
          }}
        >
          <SelectTrigger className="w-[180px] border-[1px] border-primary">
            <SelectValue placeholder="Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="mobile">Mobile</SelectItem>
            <SelectItem value="computer">Computer</SelectItem>
            <SelectItem value="desktop">Desktop</SelectItem>
            <SelectItem value="laptop">Laptops</SelectItem>
            <SelectItem value="electronic-assessories">
              Electronic Assessories
            </SelectItem>
          </SelectContent>
        </Select>
        <Link href={"/main/profile"}>
          <Avatar className="bg-primary text-secondary">
            <AvatarFallback className="bg-primary text-secondary font-bold">
              {fallback}
            </AvatarFallback>
          </Avatar>
        </Link>
      </div>
    </nav>
  );
}
