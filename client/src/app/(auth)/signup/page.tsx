"use client";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
interface Iuser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  username: string;
  confirmPassword: string;
}
export default function SignupPage() {
  const router = useRouter();
  const [user, setUser] = useState<Iuser>({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleSubmit = async (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!user.firstName || !user.lastName || !user.email || !user.password) {
      alert("all fields are mandatory");
    }
    const response = await fetch("http://localhost:8000/api/v1/auth/signup", {
      body: JSON.stringify(user),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.status === 201) {
      router.push("/login");
    }
  };

  return (
    <div className="flex flex-col gap-4 justify-center items-center w-full h-[100vh]">
      <h3 className="text-lg font-semibold capitalize text-neutral-500">
        signup to start chatting and sharing your pretty moments with
        others{" "}
      </h3>
      <form className="flex flex-col gap-4 min-w-[700px] px-3 py-6 border">
        <div className="flex gap-4">
          <Input
            className="w-full px-3 py-2   w-full border"
            type="text"
            name="firstName"
            placeholder="firstName"
            onChange={handleChange}
          />
          <Input
            type="text"
            name="lastName"
            placeholder="lastName"
            className="w-full px-3 py-2   w-full border"
            onChange={handleChange}
          />
        </div>
        <Input
          type="email"
          placeholder="email"
          onChange={handleChange}
          name="email"
          className="w-full px-3 py-2   w-full border"
        />
        <Input
          type="mail"
          placeholder="username"
          onChange={handleChange}
          name="username"
          className="w-full px-3 py-2   w-full border"
        />
        <Input
          name="password"
          type="password"
          placeholder="password"
          className="w-full px-3 py-2   w-full border border-netural-200"
          onChange={handleChange}
        />
        <Input
          type="password"
          placeholder="confirm-password"
          className="w-full px-3 py-2   w-full border"
          name="confirmPassword"
          onChange={handleChange}
        />
        {user.password !== user.confirmPassword && (
          <span className="text-red-500 text-right">
            password does not match with confirm password
          </span>
        )}
        <Button
          type="submit"
          size={"icon-lg"}
          className="w-full px-3 py-2   w-full h-12"
          onClick={handleSubmit}
        >
          Create Account
        </Button>
      </form>
    </div>
  );
}
