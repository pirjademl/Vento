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

  useEffect(() => {
    console.log("rerendering the component ");
  });

  return (
    <div className="flex items-center justify-center min-h-screen w-full border border-red-500">
      <div className="max-w-5xl w-full border  p-5 h-full">
        <div>
          <div className="flex items-center justify-center">
            <UserIcon size={25} />
          </div>
          <div className="px-12 py-12 flex flex-col gap-6">
            <div className="flex  gap-4 justify-between">
              <span>Username</span>
              <Input value={isUpdating ? "" : user.username} />
            </div>
            <div className="flex items-center gap-4 justify-between">
              <span>FirstName</span>

              <Input value={isUpdating ? "" : user.firstName} />
            </div>
            <div className="flex items-center gap-4 justify-between">
              <span>LastName</span>

              <Input value={isUpdating ? "" : user.lastName} />
            </div>
            <div className="flex items-center gap-4 justify-between">
              <span>email</span>

              <Input value={isUpdating ? "" : user.email} />
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              onClick={() => setIsUpdating(!isUpdating)}
              variant={"outline"}
            >
              Update
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
