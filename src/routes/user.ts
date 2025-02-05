import express from 'express'
import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { isEmail } from 'validator'


const prisma = new PrismaClient()

const userRouter = express.Router()

userRouter.post('/', async (req:Request, res: Response) => {
    const { name, email } = req.body // collect user and email from request body

    // validate both

    if (!name || typeof(name) !== 'string') {
        res.status(400).json({
            error: "Name is either absent or not of correct format - should be a string"
        })
        return
    }
    if (!email || !isEmail(email)) {
        res.status(400).json({
            error: "Email is either absent or not of correct format - should be an email"
        })
        return
    }


    // Attempt to create new record
    try {
        await prisma.user.create({
            data: {
                email: email,
                name: name
            }
        })
        res.json({
            message: "Successfully added email"
        })
        return
    } catch (error: any) {
        // check if error is generated because of duplicate emails
        if (error.code === 'P2002') {
            res.json({
                message: "User email already exists"
            })
            return
        }
    }
})




export default userRouter