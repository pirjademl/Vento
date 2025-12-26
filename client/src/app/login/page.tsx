"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { time } from "console";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useState } from "react";
import { toast } from "sonner";
interface ILoginRequest {
  email: string;
  password: string;
}

export default function LoginPage() {
  const [user, setUser] = useState({ email: "", password: "" });
  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUser((prevUser) => ({ ...prevUser, [e.target.name]: e.target.value }));
  };
  const handleSubmit = async (e: FormEvent<SubmitEvent>) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://10.133.155.166:8000/api/v1/auth/login",
        {
          body: JSON.stringify(user),
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      const data = await response.json();
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("username", data.username);
      if (response.status === 201 || response.status === 200) {
        toast("Login successfully", {
          description: Date.now.toString(),
          action: {
            label: "Undo",
            onClick: () => console.log("Undo"),
          },
        });
        router.push(`/rooms`);
      }
      if (response.status == 404)
        toast("No user found with that email", {
          description: Date.now.toString(),
          action: {
            label: "Undo",
            onClick: () => console.log("Undo"),
          },
        });
    } catch (e) {
      console.dir(e);

      toast.error("Network Error", {
        description: "",
        action: {
          label: "undo",
        },
      });
    }
  };
  return (
    <div className="w-full h-[100vh] flex justify-center items-center">
      <div className="min-w-[700px] flex flex-col gap-4">
        <h1 className="text-3xl font-bold text-center">
          Login with your account and resume chatting{" "}
        </h1>
        <form className="flex flex-col gap-4 border  p-4">
          <div className="flex group gap-3  flex items-center capitalize">
            <label className="w-1/6"> email</label>
            <Input
              type="email"
              name="email"
              className="p-3   w-full "
              onChange={handleChange}
            />
          </div>

          <div className=" flex group gap-3  flex items-center ">
            <label className="w-1/6 capitalize"> password</label>
            <Input
              type="password"
              name="password"
              className="p-3    w-full "
              onChange={handleChange}
            />
          </div>
          <Button
            size={"lg"}
            type="submit"
            className="bg-gray-400 px-4 py-3"
            onClick={handleSubmit}
          >
            submit
          </Button>
        </form>
      </div>
    </div>
  );
}
