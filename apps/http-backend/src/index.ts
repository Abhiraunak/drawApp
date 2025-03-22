import express from "express";
import jwt from "jsonwebtoken";
import { roomSchema, signInSchema, userSchema } from "@repo/common/types";
import { JWT_SECRET } from "@repo/backend-common/config";
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

    try {

        const user = await prismaClient.user.create({
            data: {
                email: parseData.data?.username,
                password: parseData.data?.password,
                name: parseData.data.name
            }
        })

        res.json({
            userId: user.id
        })

    } catch (e) {
        res.status(411).json({
            message: "User already exits with this username"
        })
    }
})

app.post('/signin', async (req, res) => {

    const parseData = signInSchema.safeParse(req.body);
    if (!parseData.success) {
        res.json({
            message: "Incorrect Inputs"
        })
        return;
    }

    const user = await prismaClient.user.findFirst({
        where: {
            email: parseData.data.username,
            password: parseData.data.password
        }
    })

    if (!user) {
        res.status(403).json({
            message: "Not authorized"
        })
        return;
    }

    const token = jwt.sign({
        userId: user?.id
    }, JWT_SECRET)

    res.json({
        token
    })
})

app.post('/room', middleware, async (req, res) => {
    const parseData = roomSchema.safeParse(req.body);
    if (!parseData.success) {
        res.json({
            message: "Incorrect Inputs"
        })
        return;
    }

    // @ts-ignore
    const userId = req.userId;

    try {
        const room = await prismaClient.room.create({
            data: {
                slug: parseData.data.name,
                adminId: userId
            }
        })

        res.json({
            roomId: room.id
        })
    } catch(e){
        res.status(411).json({
            message : "Room already exist with this name"
        })
    }

})

app.get("chats/:roomId", async (req, res) => {
    const roomId = Number(req.params.roomId);
    const messages = await prismaClient.chat.findMany({
        where:{
            roomId: roomId
        }, 
        orderBy:{
            id: "desc"
        },
        take: 50
    });

    res.json({
        messages
    })
})

app.get("/room/:slug", async(req, res) => {
    const slug = req.params.slug;
    const room = await prismaClient.room.findFirst({
        where:{
            slug
        }
    });

    res.json({
        room
    })
})
app.listen(3000);