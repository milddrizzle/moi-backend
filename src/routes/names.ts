import express from 'express';
import { Request, Response } from 'express';
import { OpenAI } from 'openai';


const nameRouter = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // API Key from .env
});

nameRouter.get('/', async (req: Request, res: Response) => {
  // Extract parameters from the request body
  const {
    gender,
    name_origin,
    meaning,
    names_avoid,
    version,
    name_type,
  } = req.query || {};


  // Build the prompt dynamically based on user specifications
  let prompt = `Strictly stream 10 unique baby names with their meanings. The format should be "Name: Meaning(sentence)" with no extra labels, numbers, or empty lines. Ensure all names are unique, and each meaning should be 100-140 letters long. All first names should have this prefix "--" in the beginning. A strict criteria is that all names should be clearly separated using "--". Don't add the numbers`;
  if (gender) prompt += ` Focus on ${gender} names.`;
  if (name_origin) prompt += ` Limit names to the ${name_origin} origin.`;
  if (meaning) prompt += ` Ensure meanings emphasize ${meaning}.`;
  if (names_avoid) prompt += ` Exclude these names: ${names_avoid}.`;
  if (version === 'Yes') prompt += ` Include names with common nicknames.`;
  if (name_type) prompt += ` Focus on names that are ${name_type}.`;

  // Set up SSE headers so that the client can receive streaming data
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  try {
    // Start the OpenAI streaming request
    const stream = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1000,
      stream: true,
    });

    // Iterate over the streamed chunks and write each one as an SSE message
    for await (const chunk of stream) {
      res.write(`data: ${chunk.choices[0].delta.content}\n\n`);
    }

    // Indicate completion of the stream by finally sending DONE
    res.write(`data: [DONE]\n\n`);
    res.end();
  } catch (error) {
    console.error("Error generating names:", error);
    res.write(`data: ERROR: ${error}\n\n`);
    res.end();
  }
});


export default nameRouter;
