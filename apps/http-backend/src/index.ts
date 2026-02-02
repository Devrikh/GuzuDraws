import express from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { authMiddleware } from "./middleware";
import {CreateUserSchema, SignInSchema, CreateRooomSchema} from "@repo/common/types"
import {prismaClient} from "@repo/db/prisma"

const app=express();
app.use(express.json());


app.post("/signup",async (req,res)=>{


    const parsedData= CreateUserSchema.safeParse(req.body);
    console.log(parsedData);

    if(!parsedData.success){
        res.json({
            message: "Incorrect Format"
        })
        return;
    }


    try{

        const user=await prismaClient.user.create({
            data:{
                email: parsedData.data.email,
                password: parsedData.data.password,
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


    //HASH Pass
    try{



    const user = await prismaClient.user.findFirst({
        where:{
            email: parsedData.data?.email,
            password: parsedData.data.password
        }
    })

    if(!user){
        res.status(403).json({
            message: "You are not signed up"
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






app.listen(3001);