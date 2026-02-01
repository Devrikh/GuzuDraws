import express from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { authMiddleware } from "./middleware";
import {CreateUserSchema, SignInSchema, CreateRooomSchema} from "@repo/common/types"

const app=express();


app.post("/signup", (req,res)=>{


    const data= CreateUserSchema.safeParse(req.body);

    if(!data.success){
        res.json({
            message: "Incorrect Format"
        })
        return
    }

    res.json({
        userId: 123
    })

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