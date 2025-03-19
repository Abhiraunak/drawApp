import express from "express";
import jwt from "jsonwebtoken";
import { userSchema } from "@repo/common/types";
import { JWT_SECERET } from "@repo/backend-common/config";

const app = express();

app.post('/signup', (req, res) => {
    const data = userSchema.safeParse(req.body);
    if (!data.success) {
        res.status(403).json({
            message: "Wrong Input"
        })
        return;
    }
})

app.post('/signin', (req, res) => {

    const userId = 1;
    const token = jwt.sign({
        userId
    }, JWT_SECERET)

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