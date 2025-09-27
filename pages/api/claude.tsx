import type { NextApiRequest, NextApiResponse } from 'next';
import Anthropic from '@anthropic-ai/sdk';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'POST Method required, ' + req.method + ' Not Allowed' });
  }

  const { prompt } = await req.body;

  if (!prompt) {
    return res.status(400).json({ message: 'User prompt is required' });
  }

  try {
    const anthropic = new Anthropic({
      apiKey: process.env.CLAUDE_API_KEY,
    });

    const msg = await anthropic.messages.create({
      model: "claude-sonnet-4-0",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    });

    res.status(200).json({ response: msg.content });
  } catch (error) {
    console.error('Error calling Claude API:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}