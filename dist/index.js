"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const user_1 = __importDefault(require("./routes/user"));
const names_1 = __importDefault(require("./routes/names"));
const app = (0, express_1.default)();
dotenv_1.default.config(); // allow access to the environment variables from index.ts
app.use((0, cors_1.default)({
    origin: ['https://babynames.motherofinvention.com', 'https://moi-fr1z.onrender.com', 'https://moi-frontend-next.vercel.app', 'http://localhost:5173', 'http://localhost:3000'],
    methods: ["GET", "POST"],
    allowedHeaders: ['Content-Type'],
    credentials: false // disable sending authorization headers or cookies
}));
app.use(express_1.default.json()); // parse the incoming request body in json format
app.use('/user', user_1.default);
app.use('/generate', names_1.default);
const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log("Server running in port:", port);
});
