"use client";
import { ChangeEvent, useContext, useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SendIcon, Users, Crown, Info, Hash } from "lucide-react";
import { useParams } from "next/navigation";
import { WebsocketContext } from "@/context/websocket.context";
import { useFetch } from "@/utils/use-fetch";

interface ISocketMessage {
  type: "typing" | "message";
  body: string;
  username: string | any;
  room_id: number;
}
export default function RoomPage() {
  const params = useParams();
  const roomid = parseInt(params.roomid as string, 10);

  const { messages, sendMessage, currentUser } = useContext(WebsocketContext);
  const [message, setMessage] = useState<ISocketMessage>({
    type: "typing",
    body: "",
    username: currentUser,
    room_id: roomid,
  });
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data, isError, isLoading } = useFetch(`/rooms/${roomid}`);

  // Automatically scroll to the latest message
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length > 0) {
      sendMessage({
        type: "typing",
        body: "",
        username: currentUser,
        room_id: roomid,
      });
    }

    //   setMessage(event.target.value);
    setMessage((prevMessage) => ({
      ...prevMessage,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.body.trim()) return;
    sendMessage(message);
    setMessage((prevMessage) => ({
      room_id: roomid,
      body: "",
      username: currentUser,
      type: "message",
    }));
  };

  if (isLoading)
    return (
      <div className="flex h-full items-center justify-center">
        Loading room...
      </div>
    );

  return (
    <div className="flex h-[calc(100vh-80px)] w-full overflow-hidden bg-slate-50 dark:bg-zinc-950">
      {/* --- Main Chat Section --- */}
      <div className="flex flex-1 flex-col border-r border-slate-200 dark:border-zinc-800">
        {/* Chat Header Area */}
        <div className="flex items-center justify-between border-b bg-white px-6 py-4 dark:bg-zinc-900">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2 text-blue-600 dark:bg-blue-900/30">
              <Hash size={20} />
            </div>
            <div>
              <h1 className="text-lg font-bold leading-none">
                {data?.fullname || "Discussion"}
              </h1>
              <span className="text-xs text-green-500 font-medium">
                ● Online
              </span>
            </div>
          </div>
        </div>

        {/* Messages Display (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, index) => {
            const isMe = msg.username === currentUser;
            return (
              <div
                key={index}
                className={`flex w-full ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`flex flex-col gap-1 max-w-[80%] ${isMe ? "items-end" : "items-start"}`}
                >
                  {!isMe && (
                    <span className="ml-2 text-xs font-semibold text-slate-500">
                      {msg.username}
                    </span>
                  )}
                  <div
                    className={`px-4 py-2.5 shadow-sm text-sm ${
                      isMe
                        ? "bg-blue-600 text-white rounded-2xl rounded-tr-none"
                        : "bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-2xl rounded-tl-none"
                    }`}
                  >
                    <p className="leading-relaxed">{msg.body}</p>
                  </div>
                  <span className="px-2 text-[10px] text-slate-400">
                    {msg.send_at}
                  </span>
                </div>
              </div>
            );
          })}
          <div ref={scrollRef} /> {/* Anchor for scrolling */}
        </div>

        {/* Input Bar */}
        <div className="bg-white p-4 dark:bg-zinc-900 border-t">
          <form
            onSubmit={handleSubmit}
            className="mx-auto max-w-4xl flex items-center gap-2"
          >
            <Input
              name="message"
              className="flex-1 rounded-full border-slate-200 bg-slate-50 px-6 py-6 focus-visible:ring-blue-500 dark:bg-zinc-800"
              placeholder="Message this room..."
              value={message.body}
              onChange={handleInputChange}
            />
            <Button
              type="submit"
              size="icon"
              className="h-12 w-12 rounded-full shadow-lg transition-transform active:scale-90"
            >
              <SendIcon size={20} />
            </Button>
          </form>
        </div>
      </div>

      {/* --- Sidebar (Info & Participants) --- */}
      <aside className="hidden w-80 flex-col bg-white lg:flex dark:bg-zinc-900">
        <div className="p-6 space-y-8 overflow-y-auto">
          {/* Room Details */}
          <section>
            <div className="mb-4 flex items-center gap-2 text-slate-400">
              <Info size={16} />
              <span className="text-xs font-bold uppercase tracking-wider">
                About Room
              </span>
            </div>
            <div className="rounded-xl bg-slate-50 p-4 dark:bg-zinc-800/50">
              <p className="text-sm text-slate-600 dark:text-zinc-300 leading-relaxed">
                {data?.description}
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs font-medium text-blue-600">
                <Crown size={14} />
                <span>Owner: {data?.username}</span>
              </div>
            </div>
          </section>

          {/* Participants List */}
          <section>
            <div className="mb-4 flex items-center gap-2 text-slate-400">
              <Users size={16} />
              <span className="text-xs font-bold uppercase tracking-wider">
                Participants ({data?.Participants?.length || 0})
              </span>
            </div>
            <div className="space-y-3">
              {data?.Participants?.map((participant, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-lg border border-transparent bg-white p-3 shadow-sm transition-colors hover:border-slate-200 dark:bg-zinc-800"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold uppercase">
                      {participant.username.charAt(0)}
                    </div>
                    <span className="text-sm font-medium">
                      {participant.username}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {new Date(participant.joined_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </aside>
    </div>
  );
}
