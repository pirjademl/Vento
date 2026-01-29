"use client";
import {
  ChangeEvent,
  FormEventHandler,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  SendIcon,
  Users,
  Crown,
  Info,
  Hash,
  PlusCircle,
  DownloadCloudIcon,
  DownloadIcon,
  Plus,
} from "lucide-react";
import { useParams } from "next/navigation";
import { WebsocketContext } from "@/context/websocket.context";
import { useFetch } from "@/utils/use-fetch";
import { UploadToS3 } from "@/lib/utils";
import { toast } from "sonner";
import { Messages } from "@/components/Messages";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

interface ISocketMessage {
  type: "typing" | "message" | "file";
  body: string;
  file?: string;
  fileName?: string;
  username: string | any;
  room_id: number;
}
export default function RoomPage() {
  const params = useParams();
  const roomid = parseInt(params.roomid as string, 10);

  const { sendMessage, messages, currentUser } = useContext(WebsocketContext);
  console.log("messages are coming", messages);

  const [message, setMessage] = useState<ISocketMessage>({
    type: "typing",
    body: "",
    fileName: "",
    username: currentUser,
    room_id: roomid,
  });

  const [file, setFile] = useState<File | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data, isError, isLoading } = useFetch(`/rooms/${roomid}`);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, file]);

  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setMessage((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("file when submitting request", file);
    // three posibilities
    // first no file
    // file is present but not any text
    // only text no file
    if (!file && !message.body.trim()) {
      console.log("no file and also no body to send");
      return;
    }
    if (!file && message.body.trim()) {
      console.log("no file   but body to send");
      sendMessage(message);
      setMessage((msg) => ({ ...msg, body: "" }));
      return;
    }
    if (file && message.body.trim()) {
      console.log("both  file body to send");
      const url = await UploadToS3(file);
      if (!url || url === "") {
        toast("Failed to upload file to the server");
        return;
      }
      sendMessage({ ...message, file: url });
      return;
    }
    if (file && !message.body.trim()) {
      console.log("  file but no body to send");
      const url = await UploadToS3(file);
      if (!url || url === "") {
        toast("Failed to upload file to the server");
        return;
      }
      sendMessage({ ...message, file: url });
    }
  };

  if (isLoading)
    return (
      <div className="flex h-full items-center justify-center">
        Loading room...
      </div>
    );

  return (
    <div className="flex h-[calc(100vh-80px)] w-full overflow-hidden bg-slate-50 dark:bg-zinc-950">
      <div className="flex flex-1 flex-col border-r border-slate-200 dark:border-zinc-800">
        <div className="flex items-center justify-between border-b bg-white px-6 py-4 dark:bg-zinc-900">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2 text-blue-600 dark:bg-blue-900/30">
              <Hash size={20} />
            </div>
            <div>
              <h1 className="text-lg font-bold leading-none">
                {data?.name || "Discussion"}
              </h1>
              <span className="text-xs text-green-500 font-medium">
                ● Online
              </span>
            </div>
          </div>
        </div>

        {/*:TODO make the message component seprate causing issues  */}

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <Messages msgs={messages} user={currentUser} />
          <div ref={scrollRef} />
        </div>
        <div className="min-w-6xl mx-auto ">
          <div className="">
            <form
              onSubmit={handleSubmit}
              className="mx-auto max-w-4xl flex items-center gap-2"
            >
              <div className="flex items-center gap-2">
                <Dialog>
                  <DialogTrigger>
                    <Plus />
                  </DialogTrigger>
                </Dialog>
              </div>
              <Input
                name="body"
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
      </div>
      <aside className="hidden w-80 flex-col bg-white lg:flex dark:bg-zinc-900">
        <div className="p-6 space-y-8 overflow-y-auto">
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
