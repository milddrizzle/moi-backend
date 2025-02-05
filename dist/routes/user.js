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
const client_1 = require("@prisma/client");
const validator_1 = require("validator");
const prisma = new client_1.PrismaClient();
const userRouter = express_1.default.Router();
userRouter.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email } = req.body; // collect user and email from request body
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
        yield prisma.user.create({
            data: {
                email: email,
                name: name
            }
        });
        res.json({
            message: "Successfully added email"
        });
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
