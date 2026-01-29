"use client";
import { useEffect, useRef } from "react";

export const useNotification = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  useEffect(() => {
    // initialize teh music audo setuip
    audioRef.current = new Audio("/sounds/notification.mp3");
    audioRef.current.load();
  }, []);
  const playNotification = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch((err) => {
        console.log("Error playing notification", err);
      });
    }
  };
  return { playNotification };
};
