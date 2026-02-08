import { useEffect, useState } from "react";
import { WS_URL } from "../app/config";

export function useSocket() {
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState<WebSocket>();

  useEffect(() => {
    const ws = new WebSocket(
      `${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJmMTc1ZDM2Yi00YTY1LTQwZWYtODk3Zi1hNTNlNDI0YjdmOWQiLCJpYXQiOjE3NzAxMDg0Njd9.4-7EzLuz_J4Z0EWOLiPwEcdQvIIaDcS21ABqaJziXAk`,
    );
    ws.onopen = () => {
      setLoading(false);
      setSocket(ws);
    };
  }, []);

  return {
    socket,
    loading,
  };
}
