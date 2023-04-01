import React from "react";
import Image from "next/image";
import { Squares2X2Icon } from "@heroicons/react/24/solid";
import { Avatar, AvatarImage } from "~/components/Avatar";

export default function Sidebar({
  loggedUser,
}: {
  loggedUser: {
    id: string;
    name: string | null;
    image: string | null;
  };
}) {
  return (
    <div className="w-full border-r border-sidebar-border bg-slate-800">
      <div className="">
        <Image priority src="../logo.svg" alt="logo" width={250} height={100} />
      </div>
      <div>Search</div>
      <div className="text-gray-400">
        Dashboard
        <Squares2X2Icon className="h-6 w-6" />
      </div>
      <div className="capitalize text-gray-400">My work</div>
      <div className="capitalize text-gray-400">My projects</div>
      <div className="">
        <Avatar title="avatar">
          <AvatarImage src={loggedUser?.image ?? ""} />
        </Avatar>
      </div>
    </div>
  );
}
