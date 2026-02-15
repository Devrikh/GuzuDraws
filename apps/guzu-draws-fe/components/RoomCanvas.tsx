"use client";

import { WS_BACKEND } from "@/config";
import {  useEffect, useRef, useState } from "react";
import { Canvas } from "./Canvas";


export function RoomCanvas({roomId}:{roomId:string}){



    const [socket,setSocket]=useState<WebSocket | null>(null);

    useEffect(()=>{
        const ws= new WebSocket(`${WS_BACKEND}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJkMmY4NDhhNS0xZjViLTRlNzMtYmJjNy1lODAwMDc5Nzk4YjkiLCJpYXQiOjE3NzExMzgwOTF9.Kar7UBeyxgVPvQen0l0UKp-T34PYTo_LZPWzaty6XcM`);

        ws.onopen= ()=>{
            setSocket(ws);
            ws.send(JSON.stringify({
                type: "join_room",
                roomId: roomId
            }))
        }

    },[])

 

    if(!socket){
        return <div>
            Loading .....
        </div>
    }

    return <div>
        <Canvas roomId={roomId} socket={socket} />
    </div>
}