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
  const onNewRef = useRef(onNew);
  onNewRef.current = onNew;

  useEffect(() => {
    const token = getToken();
    const baseUrl = config.apiBaseUrl.replace(/\/api\/v1\/?$/, "");

    const socket: Socket = io(baseUrl, {
      auth: { token },
      transports: ["websocket"],
      reconnectionAttempts: 5,
    });

    socket.on("notification:new", (notification: NotificationRecord) => {
      onNewRef.current(notification);
    });

    return () => {
      socket.disconnect();
    };
  }, []); // socket created once, callback always up-to-date via ref
}
