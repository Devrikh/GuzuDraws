import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";


interface RequestUser extends Request{
    userId?: any
}



export function authMiddleware(req: RequestUser,res: Response,next: NextFunction){
        const token=req.headers["authorization"] ?? "";

        const decoded=jwt.verify(token,JWT_SECRET);

        if(decoded){

            req.userId=(decoded as JwtPayload).userId;
            next();

        }else{
            res.status(403).json({
                message: "Unaothorized"
            })
        }

}