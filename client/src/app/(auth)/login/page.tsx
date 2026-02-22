"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import Link from "next/link";
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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/api/v1/auth/login", {
        body: JSON.stringify(user),
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status === 404) {
        toast("user not found ", {
          description: "create account and try logging in ",
        });
        return;
      }

      const data = await response.json();
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("username", data.username);

      if (response.status === 201 || response.status === 200) {
        toast("Login successful", {
          description: "Redirecting to your rooms...",
        });
        router.push(`/app/rooms`);
      }
      if (response.status === 404) {
        toast.error("No user found with that email");
      }
    } catch (e) {
      console.dir(e);
      toast.error("Network Error", {
        description: "Check your connection and try again.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="flex justify-between items-center px-6 py-5 max-w-7xl mx-auto">
        <Link href="/" className="text-xl font-bold tracking-tight">
          gochat.
        </Link>
        <Link
          href="/signup"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Create account →
        </Link>
      </nav>

      {/* Login Form */}
      <div className="max-w-md mx-auto px-6 pt-24">
        <p className="mono text-sm text-muted-foreground mb-2">
          // Authentication
        </p>
        <h1 className="headline-lg mb-2">WELCOME BACK.</h1>
        <p className="text-muted-foreground mb-8">
          Sign in to continue to your conversations.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <Input
              type="email"
              name="email"
              placeholder="you@example.com"
              className="w-full"
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <Input
              type="password"
              name="password"
              placeholder="••••••••"
              className="w-full"
              onChange={handleChange}
              required
            />
          </div>

          <Button type="submit" className="w-full btn-primary mt-6">
            SIGN IN
          </Button>
        </form>

        <p className="text-sm text-muted-foreground text-center mt-8">
          Don't have an account?{" "}
          <Link href="/signup" className="text-foreground hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
