"use client";

import { useNotification } from "@/hooks/use.notification";
import { useParams } from "next/navigation";
import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";

export const WebsocketContext = createContext(null);

export interface IMessage {
  username: string;
  fileName: string;
  file: string;

  type: string;
  body: string;
  room_id: string;
  send_time: string;
}
//const audio = new AudioData();

export const WebsocketProvider = ({ children }: { children: ReactNode }) => {
  const { playNotification } = useNotification();
  const [messages, setMessage] = useState<IMessage[]>([]);
  const [currentUser, setCurrentUser] = useState<string>("");
  const [socket, setSocket] = useState<WebSocket | null>(null);

  const params = useParams();
  const roomid = params?.roomid as string;

  useEffect(() => {
    if (!roomid) return;

    const token = localStorage.getItem("access_token");
    const user = localStorage.getItem("username") || "";
    setCurrentUser(user);

    const websocket = new WebSocket(
      `ws://localhost:8000/ws/rooms/${roomid}?token=${token}`,
    );

    websocket.onmessage = (event) => {
      if (event.data.username !== currentUser) {
        playNotification();
      }

      const data = JSON.parse(event.data) as IMessage;
      console.log(data);
      setMessage((prev) => [...prev, data]);
    };

    websocket.onerror = (error) => console.error("WebSocket Error:", error);

    websocket.onclose = () => console.log("WebSocket Disconnected ❌");

    setSocket(websocket);

    // 2. Cleanup: This runs when the component unmounts or roomid changes
    return () => {
      if (
        websocket.readyState === WebSocket.OPEN ||
        websocket.readyState === WebSocket.CONNECTING
      ) {
        websocket.close();
      }
    };
  }, [roomid]); // 3. Dependency: Re-run when roomid is detected/changed

  const sendMessage = useCallback(
    (msg: IMessage) => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(msg));
      } else {
        console.warn("Socket not ready. State:", socket?.readyState);
      }
    },
    [socket],
  );

  return (
    <WebsocketContext.Provider value={{ sendMessage, messages, currentUser }}>
      {children}
    </WebsocketContext.Provider>
  );
};
