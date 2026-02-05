"use client";
import { ModeToggle } from "@/components/ui/theme.toggle";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="flex justify-between items-center px-6 py-5 max-w-7xl mx-auto">
        <Link href="/" className="text-xl font-bold tracking-tight">
          gochat.
        </Link>
        <div className="flex items-center gap-6">
          <Link
            href="/login"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Login
          </Link>
          <Link href="/signup" className="btn-primary text-sm">
            START CHATTING
          </Link>
          <ModeToggle />
        </div>
      </nav>

      {/* Hero Section */}
      <section className="section max-w-7xl mx-auto">
        <h1 className="headline-xl max-w-4xl">
          CHAT WITH EVERYONE.
          <br />
          <span className="text-muted-foreground">ALL AT ONCE.</span>
        </h1>
        <p className="mt-8 text-lg text-muted-foreground max-w-xl">
          Most apps limit you to one conversation. We built{" "}
          <strong className="text-foreground">multi-room infrastructure</strong>.
          Jump between rooms, never miss a message, stay connected with everyone
          that matters.
        </p>
        <p className="mt-4 text-sm text-muted-foreground mono">
          Real-time messaging for 50+ active users.
        </p>
      </section>

      {/* Divider */}
      <div className="divider max-w-7xl mx-auto" />

      {/* Capabilities Section */}
      <section className="section max-w-7xl mx-auto">
        <p className="mono text-sm text-muted-foreground mb-4">
          // Core Capabilities
        </p>
        <h2 className="headline-lg mb-12">BUILT FOR REAL CONVERSATIONS.</h2>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="card-clean">
            <h3 className="font-semibold text-lg mb-3">Multi-Room Messaging</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Join unlimited chat rooms. Family, work, hobbies — organize your
              conversations your way. Switch instantly, no lag.
            </p>
            <ul className="mt-4 space-y-1 text-xs mono text-muted-foreground">
              <li>• Unlimited rooms</li>
              <li>• Instant switching</li>
              <li>• Persistent history</li>
            </ul>
          </div>

          {/* Feature 2 */}
          <div className="card-clean">
            <h3 className="font-semibold text-lg mb-3">Real-Time Engine</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              WebSocket-powered delivery. Your messages arrive the moment you
              hit send. No polling, no delays—pure real-time.
            </p>
            <ul className="mt-4 space-y-1 text-xs mono text-muted-foreground">
              <li>• WebSocket infrastructure</li>
              <li>• Sub-100ms latency</li>
              <li>• Live presence indicators</li>
            </ul>
          </div>

          {/* Feature 3 */}
          <div className="card-clean">
            <h3 className="font-semibold text-lg mb-3">Create & Invite</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Spin up new rooms in seconds. Share a link, and anyone can join.
              You control who's in and who's out.
            </p>
            <ul className="mt-4 space-y-1 text-xs mono text-muted-foreground">
              <li>• One-click room creation</li>
              <li>• Shareable invite links</li>
              <li>• Room management</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="divider max-w-7xl mx-auto" />

      {/* CTA Section */}
      <section className="section max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h2 className="headline-lg">Ready to start?</h2>
            <p className="text-muted-foreground mt-2">
              Create a free account and join the conversation in under a minute.
            </p>
          </div>
          <Link href="/signup" className="btn-primary text-center">
            CREATE ACCOUNT
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 max-w-7xl mx-auto border-t border-border">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <span>© 2026 gochat</span>
          <span className="mono text-xs">Go + WebSocket + Next.js</span>
        </div>
      </footer>
    </div>
  );
}
