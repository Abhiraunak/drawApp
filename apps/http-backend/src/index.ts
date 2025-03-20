import express from "express";
import jwt from "jsonwebtoken";
import { roomSchema, signInSchema, userSchema } from "@repo/common/types";
import { JWT_SECRET }  from "@repo/backend-common/config";
import { prismaClient } from "@repo/db/client";
import { middleware } from "./middlewate";

const app = express();
app.use(express.json())

app.post('/signup', async (req, res) => {
    const parseData = userSchema.safeParse(req.body);
    if (!parseData.success) {
        res.status(403).json({
            message: "Wrong Input"
        })
        return;
    }

    try{

        const user = await prismaClient.user.create({
            data: {
                email: parseData.data?.username,
                password: parseData.data?.password,
                name: parseData.data.name
            }
        })

        res.json({
            userId : user.id
        })

    } catch(e){
        res.status(411).json({
            message : "User already exits with this username"
        })
    }
})

app.post('/signin', async(req, res) => {

    const parseData = signInSchema.safeParse(req.body);
    if(!parseData.success){
        res.json({
            message: "Incorrect Inputs"
        })
        return;
    }

    const user = await prismaClient.user.findFirst({
        where : {
            email: parseData.data.username,
            password: parseData.data.password
        }
    })

    if(!user){
        res.status(403).json({
            message: "Not authorized"
        })
        return;
    }

    const token = jwt.sign({
        userId : user?.id
    }, JWT_SECRET)

    res.json({
        token
    })
})

app.post('/room', middleware, async(req, res) => {
    const parseData = roomSchema.safeParse(req.body);
    if(!parseData.success){
        res.json({
            message: "Incorrect Inputs"
        })
        return;
    }

    // @ts-ignore
    const userId = req.userId;
    
    await prismaClient.room.create({
        data:{
            slug: parseData.data.name,
            adminId: userId
        }
    })

})
app.listen(3000);