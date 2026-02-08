"use client";
import { useRouter } from "next/navigation";
import { useRef} from "react"


export default function Home() {

  const roomIdRef = useRef<HTMLInputElement | null>(null);
  const router=useRouter();

  function joinRoom(){
    if(roomIdRef.current == null) return;
      router.push(`/room/${roomIdRef.current.value}`)
  }

  return <>
  <div style={{
  }}>
      <input ref={roomIdRef} type="text" placeholder="Room ID" />
      <button onClick={joinRoom} >Enter</button>
  </div>
  </>
}
