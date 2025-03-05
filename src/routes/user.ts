import express from 'express'
import { Request, Response } from 'express'
import { Prisma, PrismaClient } from '.prisma/client'
import { isEmail } from 'validator'
import axios from 'axios'


const prisma = new PrismaClient()

const userRouter = express.Router()

// Function to add user to Klaviyo list  
async function addUserToKlaviyo(user: any) {
    try {
        const response = await axios({
            method: 'post',
            url: 'https://a.klaviyo.com/api/v2/list/' + process.env.KLAVIYO_LIST_ID + '/members',
            params: {
                api_key: process.env.KLAVIYO_API_KEY
            },
            headers: {
                'accept': 'application/json',
                'content-type': 'application/json'
            },
            data: {
                profiles: [
                    {
                        email: user.email,
                        first_name: user.name,
                        due_date: user.due_date
                    }
                ]
            }
        })
        return response.data
    } catch (error) {
        console.error('Error adding user to Klaviyo:', error)
        throw error
    }
}

userRouter.post('/', async (req:Request, res: Response) => {
    const { name, email, due_date } = req.body // collect user and email from request body

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
        const user = await prisma.user.create({
            data: {
                email: email,
                name: name,
                due_date: due_date
            }
        })

        // Add user to Klaviyo  
        try {
            await addUserToKlaviyo(user)
            res.json({
                message: "Successfully added user and subscribed to Klaviyo"
            })
        } catch (klaviyoError: any) {
            // User was created in database but failed to add to Klaviyo
            res.status(207).json({
                message: "User created but failed to subscribe to Klaviyo",
                error: klaviyoError.message
            })
        }
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