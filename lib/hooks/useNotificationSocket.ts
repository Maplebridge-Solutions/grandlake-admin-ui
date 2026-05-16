"use client";

import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { config } from "@/lib/config";
import type { NotificationRecord } from "@/lib/api/notifications";

function getToken(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|;\s*)auth_token_client=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

export function useNotificationSocket(onNew: (n: NotificationRecord) => void) {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const token = getToken();
    const baseUrl = config.apiBaseUrl.replace(/\/api\/v1\/?$/, "");

    const socket = io(baseUrl, {
      auth: { token },
      transports: ["websocket"],
    });

    socketRef.current = socket;

    socket.on("notification:new", (notification: NotificationRecord) => {
      onNew(notification);
    });

    return () => {
      socket.disconnect();
    };
  }, [onNew]);
}
