import axios from "axios";
import { BACKEND_URL } from "../../config";
import { ChatRoom } from "../../../components/ChatRoom";

async function  getRoom(slug:string) {
    const respose= await axios.get(`${BACKEND_URL}/room/${slug}`);

    return respose.data.room.id;

}

export default async function ChatRoomHandler({
    params
}: {params: {
    slug: string
}}){

const slug= (await params).slug;
const roomId= await getRoom(slug) ;

return <ChatRoom roomId={roomId}/>




}