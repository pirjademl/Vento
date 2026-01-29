"use client";

import { WebsocketProvider } from "@/context/websocket.context";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BellDotIcon, User, MessageSquare, Users } from "lucide-react";

export default function RoomLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <WebsocketProvider>{children}</WebsocketProvider>;
}
