import { IMessage } from "@/context/websocket.context";
import { DownloadIcon } from "lucide-react";

export const Message = ({
  msg,
  user,
  previousMessages,
}: {
  msg: IMessage;
  user: string;
}) => {
  console.log(msg);
  const isMe = msg.username === user;
  const isOnlyFile = msg.file !== "" && msg.body === "";
  const FileWithMsg = msg.file !== "" && msg.body !== "";
  return (
    <div
      className={`flex w-full ${isMe ? "justify-end" : "justify-start"}  mt-5`}
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
          {msg.file !== "" && (
            <div className=" flex items-center justify-between gap-5 shadow-md border">
              <span>{msg.fileName}</span>
              <DownloadIcon size={15} />{" "}
            </div>
          )}
          {msg.file === "" && <p className="leading-relaxed">{msg.body}</p>}
        </div>
        <span className="px-2 text-[10px] text-slate-400">{msg.send_at}</span>
      </div>
    </div>
  );
};

export const Messages = ({
  msgs,
  user = "",
}: {
  msgs: IMessage[];
  user: string;
}) => {
  if (!msgs || msgs.length <= 0) {
    return <div>No Message As of Now</div>;
  }
  return (
    <div className="">
      {msgs.map((msg, val) => (
        <Message msg={msg} key={val} user={user} />
      ))}
    </div>
  );
};
