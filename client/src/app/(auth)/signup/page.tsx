"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChangeEvent, FormEvent, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  username: string;
  confirmPassword: string;
}

export default function SignupPage() {
  const router = useRouter();
  const [user, setUser] = useState<IUser>({
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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user.firstName || !user.lastName || !user.email || !user.password) {
      toast.error("All fields are required");
      return;
    }

    if (user.password !== user.confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    const response = await fetch("http://localhost:8000/api/v1/auth/signup", {
      body: JSON.stringify(user),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 201) {
      toast.success("Account created");
      router.push("/login");
    }
  };

  const passwordsMatch =
    user.password === user.confirmPassword || user.confirmPassword === "";

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Left Side - Info */}
      <div className="hidden lg:flex lg:w-2/5 border-r border-border flex-col justify-between p-12">
        <Link href="/" className="text-xl font-bold tracking-tight">
          gochat.
        </Link>

        <div>
          <p className="mono text-xs text-muted-foreground mb-6">
            // Why gochat?
          </p>
          <div className="space-y-8">
            <div>
              <h3 className="font-semibold mb-1">Multi-room messaging</h3>
              <p className="text-sm text-muted-foreground">
                Join unlimited conversations simultaneously.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-1">Real-time delivery</h3>
              <p className="text-sm text-muted-foreground">
                WebSocket-powered. No delays.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-1">Create & manage rooms</h3>
              <p className="text-sm text-muted-foreground">
                Your space, your rules.
              </p>
            </div>
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          © 2026 gochat
        </p>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex flex-col">
        {/* Mobile nav */}
        <nav className="lg:hidden flex justify-between items-center px-6 py-5">
          <Link href="/" className="text-xl font-bold tracking-tight">
            gochat.
          </Link>
          <Link
            href="/login"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Sign in →
          </Link>
        </nav>

        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-sm">
            <div className="text-right mb-8 hidden lg:block">
              <Link
                href="/login"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Already have an account? Sign in →
              </Link>
            </div>

            <h1 className="text-3xl font-bold tracking-tight mb-2">
              Create account
            </h1>
            <p className="text-muted-foreground mb-8">
              Start chatting in under a minute.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Input
                  type="text"
                  name="firstName"
                  placeholder="First name"
                  onChange={handleChange}
                  required
                />
                <Input
                  type="text"
                  name="lastName"
                  placeholder="Last name"
                  onChange={handleChange}
                  required
                />
              </div>

              <Input
                type="text"
                name="username"
                placeholder="Username"
                onChange={handleChange}
                required
              />

              <Input
                type="email"
                name="email"
                placeholder="Email"
                onChange={handleChange}
                required
              />

              <Input
                type="password"
                name="password"
                placeholder="Password"
                onChange={handleChange}
                required
              />

              <Input
                type="password"
                name="confirmPassword"
                placeholder="Confirm password"
                className={!passwordsMatch ? "border-red-500 focus:border-red-500" : ""}
                onChange={handleChange}
                required
              />

              {!passwordsMatch && (
                <p className="text-xs text-red-500">Passwords don't match</p>
              )}

              <Button
                type="submit"
                className="w-full h-11 mt-2"
                disabled={!passwordsMatch}
              >
                Create account
              </Button>
            </form>

            <p className="text-xs text-muted-foreground text-center mt-6">
              By signing up, you agree to our Terms of Service.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
