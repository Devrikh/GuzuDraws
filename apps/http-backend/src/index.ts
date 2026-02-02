import express from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { authMiddleware } from "./middleware";
import {CreateUserSchema, SignInSchema, CreateRooomSchema} from "@repo/common/types"
import {prisma} from "@repo/db/prisma"

const app=express();


app.post("/signup",async (req,res)=>{


    const parsedData= CreateUserSchema.safeParse(req.body);

    if(!parsedData.success){
        res.json({
            message: "Incorrect Format"
        })
        return
    }


    try{

        const user=await prisma.user.create({
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
            message: "Error in DB"
        })
    }

})


app.post("/signin",(req,res)=>{

    const data= SignInSchema.safeParse(req.body);
    if(!data.success){
        res.json({
            message: "Incorrect Format"
        })
        return
    }

    const userId=1;

     const token= jwt.sign({
        userId
    },JWT_SECRET);

    res.json({
        token: token
    })


})


app.post("/room",authMiddleware, (req,res)=>{

    const data= CreateRooomSchema.safeParse(req.body);
    if(!data.success){
        res.json({
            message: "Incorrect Format"
        })
        return
    }

    res.json({
        roomId: 123
    })

})






app.listen(3001);