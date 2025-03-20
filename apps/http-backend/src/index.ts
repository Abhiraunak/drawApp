import express from "express";
import jwt from "jsonwebtoken";
import { userSchema } from "@repo/common/types";
import { JWT_SECRET }  from "@repo/backend-common/config";
import { prismaClient } from "@repo/db/client";

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

app.post('/signin', (req, res) => {

    const userId = 1;
    const token = jwt.sign({
        userId
    }, JWT_SECRET)

    res.json({
        token
    })

    // db call

    res.json({
        userId: "123"
    })

})

app.post('/room', (req, res) => {

})
app.listen(3000);