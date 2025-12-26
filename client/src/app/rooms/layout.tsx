import { BellDotIcon, MessagesSquare, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { WebsocketProvider } from "@/context/websocket.context";

export default function ChatRoomLayout({ children }) {
  return (
    <div className="flex h-screen flex-col bg-slate-50 dark:bg-zinc-950 font-sans">
      {/* --- Glassmorphism Header --- */}
      <header className="sticky top-0 z-50 h-16 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/80">
        <nav className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-500/30">
              <MessagesSquare size={22} />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white uppercase font-playful">
              WWChat
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="relative text-slate-600 dark:text-zinc-400"
            >
              <BellDotIcon size={20} />
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-zinc-900" />
            </Button>

            <div className="h-6 w-px bg-slate-200 dark:bg-zinc-800 mx-1" />

            <Button
              asChild
              variant="secondary"
              className="gap-2 rounded-full px-4 font-medium transition-all hover:scale-105"
            >
              <Link href="/profile">
                <User size={18} />
                <span className="hidden sm:inline">Profile</span>
              </Link>
            </Button>
          </div>
        </nav>
      </header>

      {/* --- Main Content Area --- */}
      <div className="flex flex-1 overflow-hidden">
        {/* Main Chat/Content Slot */}
        <main className="relative flex flex-1 flex-col overflow-y-auto bg-white dark:bg-zinc-900 shadow-inner">
          {children}
        </main>
      </div>
    </div>
  );
}
