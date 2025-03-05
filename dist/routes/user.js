"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require(".prisma/client");
const validator_1 = require("validator");
const axios_1 = __importDefault(require("axios"));
const prisma = new client_1.PrismaClient();
const userRouter = express_1.default.Router();
// Function to add user to Klaviyo list  
function addUserToKlaviyo(user) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield (0, axios_1.default)({
                method: 'post',
                url: 'https://a.klaviyo.com/api/v2/list/' + process.env.KLAVIYO_LIST_ID + '/members',
                params: {
                    api_key: process.env.KLAVIYO_API_KEY
                },
                data: {
                    profiles: [
                        {
                            email: user.email,
                            first_name: user.name,
                            properties: {
                                due_date: user.due_date
                            }
                        }
                    ]
                }
            });
            return response.data;
        }
        catch (error) {
            console.error('Error adding user to Klaviyo:', error);
            throw error;
        }
    });
}
userRouter.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, due_date } = req.body; // collect user and email from request body
    // validate both
    if (!name || typeof (name) !== 'string') {
        res.status(400).json({
            error: "Name is either absent or not of correct format - should be a string"
        });
        return;
    }
    if (!email || !(0, validator_1.isEmail)(email)) {
        res.status(400).json({
            error: "Email is either absent or not of correct format - should be an email"
        });
        return;
    }
    // Attempt to create new record
    try {
        const user = yield prisma.user.create({
            data: {
                email: email,
                name: name,
                due_date: due_date
            }
        });
        // Add user to Klaviyo  
        try {
            yield addUserToKlaviyo(user);
            res.json({
                message: "Successfully added user and subscribed to Klaviyo"
            });
        }
        catch (klaviyoError) {
            // User was created in database but failed to add to Klaviyo  
            res.status(207).json({
                message: "User created but failed to subscribe to Klaviyo",
                error: klaviyoError.message
            });
        }
        return;
    }
    catch (error) {
        // check if error is generated because of duplicate emails
        if (error.code === 'P2002') {
            res.json({
                message: "User email already exists"
            });
            return;
        }
    }
}));
exports.default = userRouter;
