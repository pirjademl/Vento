"use client";

import { useParams } from "next/navigation";
import { createContext, useCallback, useEffect, useState } from "react";

export const WebsocketContext = createContext(null);

export interface IMessage {
  username: string;
  body: string;
  room_id: string;
  send_time: string;
}

export const WebsocketProvider = ({ children }) => {
  const [messages, setMessage] = useState<IMessage[]>([]);
  const [currentUser, setCurrentUser] = useState<string | "">("");
  const [socket, SetSocket] = useState<WebSocket | null>(null);
  const params = useParams();
  const { roomid } = params;

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const user = localStorage.getItem("username");

    const websocket = new WebSocket(
      `ws://localhost:8000/ws/rooms/${roomid}?token=${token}`,
    );

    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessage((prevMessages) => [...prevMessages, data]);
      setCurrentUser(user);
    };
    SetSocket(websocket);
    return () => {
      if (websocket.CLOSING) {
        websocket.close;
      }
    };
  }, [roomid]);
  const sendMessage = useCallback(
    (msg: IMessage) => {
      console.log("trying to send a message", msg);
      if (socket && socket?.readyState == socket.OPEN) {
        console.log("sending message");
        console.log(msg);
        socket.send(JSON.stringify(msg));
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
