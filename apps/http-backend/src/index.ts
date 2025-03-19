import express from "express";
import jwt from "jsonwebtoken";
import { JWT_SECERET } from "@repo/backend-common/config";

const app = express();

app.post('/signup', (req, res) => {

})

app.post('/signin', (req, res) => {

    const userId = 1;
    const token = jwt.sign({
        userId
    }, JWT_SECERET)

    res.json({
        token
    })

})

app.post('/room', (req, res) => {
    
})
app.listen(3000);