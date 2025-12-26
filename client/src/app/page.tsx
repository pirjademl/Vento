"use client";
import { ModeToggle } from "@/components/ui/theme.toggle";
import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto border">
      <nav className="flex justify-between px-3">
        <div>gochat</div>
        <div className="flex gap-4">
          <button>
            <Link href="/login">Login</Link>
          </button>
          <button>
            <Link href="/signup">Signup</Link>
          </button>
        </div>
        <div>
          <ModeToggle />
        </div>
      </nav>
    </div>
  );
}
