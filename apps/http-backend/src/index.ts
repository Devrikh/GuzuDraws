import express from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { authMiddleware } from "./middleware";
import {CreateUserSchema, SignInSchema, CreateRooomSchema} from "@repo/common/types"
import {prismaClient} from "@repo/db/prisma"
import bcrypt from "bcrypt";

const app=express();
app.use(express.json());


app.post("/signup",async (req,res)=>{


    const parsedData= CreateUserSchema.safeParse(req.body);

    if(!parsedData.success){
        res.json({
            message: "Incorrect Format"
        })
        return;
    }


    try{

        
        const hashedPass=bcrypt.hashSync(parsedData.data.password,10);
        const user=await prismaClient.user.create({
            data:{
                email: parsedData.data.email,
                password: hashedPass,
                name: parsedData.data.name
            }
        })

        res.json({
            message: user.id
        })

    }catch(e){
        console.log(e)
        res.status(411).json({
            message: "Error in DB",
            error: e
        })
    }

})


app.post("/signin",async (req,res)=>{

    const parsedData= SignInSchema.safeParse(req.body);

    

    if(!parsedData.success){
        res.json({
            message: "Incorrect Format"
        })
        return
    }


    try{



    const user = await prismaClient.user.findFirst({
        where:{
            email: parsedData.data?.email,
        }
    })



    if(!user){
        res.status(403).json({
            message: "You are not signed up"
        })
        return;
    }

    if (!bcrypt.compareSync(parsedData.data.password,user.password)){
         res.status(403).json({
            message: "Wrong Credentials"
        })
        return;
    }

    const userId=user?.id;
    const token= jwt.sign({
        userId
    },JWT_SECRET);

    res.json({
        token: token
    })

    }catch(e){
        res.status(411).json({
            message: "Error in DB",
            error: e
        })
}


})


app.post("/room",authMiddleware, async (req,res)=>{

    const parsedData= CreateRooomSchema.safeParse(req.body);
    if(!parsedData.success){
        res.json({
            message: "Incorrect Format"
        })
        return
    }

    //@ts-ignore 
    const userId=req.userId;

    try{
    const room= await prismaClient.room.create({
        data:{
           slug : parsedData.data.slug,
           adminId: userId
        }
    })


    res.json({
        roomId: room.id
    })}catch(e){
        res.status(411).json({
            message: "Error in DB",
            error: e
        })
    }

})


app.get("/chats/:roomId", async (req,res)=>{
    const roomId = Number(req.params.roomId);

    const messages = await prismaClient.chat.findMany({
        where: {
            roomId: roomId
        },
        take: 50,
        orderBy:{
            id: "desc"
        }
    })


    res.json({
        messages
    })

})





app.listen(3001);