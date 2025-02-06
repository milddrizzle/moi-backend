import express from "express";
import dotenv from 'dotenv'
import cors from 'cors'
import userRouter from "./routes/user";
import nameRouter from "./routes/names";


const app = express()
dotenv.config() // allow access to the environment variables from index.ts

app.use(cors({
    origin: ['https://babynames.motherofinvention.com', 'https://moi-fr1z.onrender.com', 'http://localhost:5173'],
    methods: ["GET", "POST"],
    allowedHeaders: ['Content-Type'],
    credentials: false // disable sending authorization headers or cookies
}))


app.use(express.json()) // parse the incoming request body in json format

app.use('/user', userRouter)
app.use('/generate', nameRouter)


const port = process.env.PORT || 3001

app.listen(port, () => {
    console.log("Server running in port:",port)
})