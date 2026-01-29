"use client";

import { apiInstance } from "@/api/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFetch } from "@/utils/use-fetch";
import { UserIcon } from "lucide-react";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const { data: user, isError, isLoading } = useFetch("/user");

  return (
    <div className="max-w-6xl  mx-auto mt-15 grid min-h-screen">
      <div className="wrapper flex gap-4">
        <div className="flex w-1/4 border flex flex-col gap-3">
          <div className=" p-4   mt-15 flex items-center justify-center flex-col gap-5">
            <div className="rounded-full min-w-[150px] border h-[150px] it flex flex-col  items-center justify-center">
              <UserIcon />
            </div>
            <span className="text-sm font-semibold">{user.email}</span>
          </div>
        </div>
        <div className="flex w-full border border-green-500">
          <div className="wrapper flex gap-4">
            <div className="flex w-1/4 border flex flex-col gap-3">
              <div className=" p-4   mt-15 flex items-center justify-center flex-col gap-5">
                <div className="">
                  <span>{user.firstName}</span>
                </div>
                <span className="text-sm font-semibold">{user.email}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
