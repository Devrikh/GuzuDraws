"use client";

import { useEffect, useRef, useState } from "react";
import { useSocket } from "../hooks/useSocket";

export function ChatRoomClient({
  messages,
  roomId,
}: {
  messages: {message: string}[];
  roomId: string;
}) {
  const { loading, socket } = useSocket();
  const [chats, setChats] = useState(messages);
  const inputMessageRef=useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (socket && !loading) {

        socket.send(JSON.stringify({
            type: "join_room",
            roomId: roomId
        }))

      socket.onmessage = (event) => {
        const parsedData = JSON.parse(event.data);

        if (parsedData.type == "chat" && parsedData.roomId == roomId) {
          setChats([...chats, {message: parsedData.message}]);
        }
      };
    }

    return ()=>{
        socket?.close();
    }
  }, [socket, loading, roomId]);


  function sendMessage(){
      socket?.send(JSON.stringify({
            type: "chat",
            roomId: roomId,
            message: inputMessageRef.current?.value
      }))
  }



  return <>
  {chats.map((m, index) => <div key={index} >{m.message}</div>)}

  <input ref={inputMessageRef} type="text" />
  <button onClick={sendMessage}>Send</button>
  </>
}
