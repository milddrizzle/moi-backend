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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const openai_1 = require("openai");
const nameRouter = express_1.default.Router();
const openai = new openai_1.OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // API Key from .env
});
nameRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_1, _b, _c;
    // Extract parameters from the request body
    const { gender, name_origin, meaning, names_avoid, version, name_type, } = req.query || {};
    // Build the prompt dynamically based on user specifications
    let prompt = `Strictly stream 10 unique baby names with their meanings. The format should be "Name: Meaning(sentence)" with no extra labels, numbers, or empty lines. Ensure all names are unique, and each meaning should be 100-140 letters long. All first names should have this prefix "--" in the beginning. A strict criteria is that all names should be clearly separated using "--". Don't add the numbers`;
    if (gender)
        prompt += ` Focus on ${gender} names.`;
    if (name_origin)
        prompt += ` Limit names to the ${name_origin} origin.`;
    if (meaning)
        prompt += ` Ensure meanings emphasize ${meaning}.`;
    if (names_avoid)
        prompt += ` Exclude these names: ${names_avoid}.`;
    if (version === 'Yes')
        prompt += ` Include names with common nicknames.`;
    if (name_type)
        prompt += ` Focus on names that are ${name_type}.`;
    // Set up SSE headers so that the client can receive streaming data
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    try {
        // Start the OpenAI streaming request
        const stream = yield openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 1000,
            stream: true,
        });
        try {
            // Iterate over the streamed chunks and write each one as an SSE message
            for (var _d = true, stream_1 = __asyncValues(stream), stream_1_1; stream_1_1 = yield stream_1.next(), _a = stream_1_1.done, !_a; _d = true) {
                _c = stream_1_1.value;
                _d = false;
                const chunk = _c;
                res.write(`data: ${chunk.choices[0].delta.content}\n\n`);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_d && !_a && (_b = stream_1.return)) yield _b.call(stream_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        // Indicate completion of the stream by finally sending DONE
        res.write(`data: [DONE]\n\n`);
        res.end();
    }
    catch (error) {
        console.error("Error generating names:", error);
        res.write(`data: ERROR: ${error}\n\n`);
        res.end();
    }
}));
exports.default = nameRouter;
