import { WebSocket, WebSocketServer } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import {prismaClient} from "@repo/db/prisma";

const wss=new WebSocketServer({port:8080});

interface User{
    ws: WebSocket,
    rooms: string[],
    userId: string
}


const users: User[]=[];



function checkUser(token:string): string | null{

    try{
    const payload=jwt.verify(token,JWT_SECRET);
    if(typeof payload == "string"){
        return null;
    }

    if(!payload || !payload.userId ){
        return null;
    }

    return payload.userId;

    }catch(e){
        return null
    }
}

wss.on("connection",function connection(ws, request){

    const url=request.url;
    if(!url){
        return
    }
    const queryParams=new URLSearchParams(url.split("?")[1]);
    const token= queryParams.get("token")?? "";

    const authenticatedUserId= checkUser(token);

    if(!authenticatedUserId){
        ws.close()
        return;
    }


    users.push({
        userId: authenticatedUserId,
        rooms: [],
        ws
    })


    ws.on("message", async function message(data){
            
        const parsedData= JSON.parse(data as unknown as string);

        if(parsedData.type =="join_room"){
            const user= users.find(x => x.ws===ws);
            if(!user) return ;
            user?.rooms.push(parsedData.roomId);
        }

        if(parsedData.type=="leave_room"){
            const user= users.find(x => x.ws===ws);
            if(!user) return ;
            user.rooms= user?.rooms.filter(x=> x !== parsedData.roomId);
            console.log(user.rooms)
        }

         if(parsedData.type=="chat"){
            const roomId= parsedData.roomId;
            const message= parsedData.message;


            await prismaClient.chat.create({
                data:{
                    userId: authenticatedUserId ,
                    message:message ,
                    roomId:roomId
                }
            })

            users.forEach( user => {
                if(user.rooms.includes(roomId)){
                    user.ws.send(JSON.stringify({
                        type: "chat",
                        message: message,
                        roomId: roomId
                    }))
                }
            })






        }


    });




})
