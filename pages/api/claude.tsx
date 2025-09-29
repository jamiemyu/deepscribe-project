import type { NextApiRequest, NextApiResponse } from 'next';
import Anthropic from '@anthropic-ai/sdk';

const SYSTEM_PROMPT = `You are a medical information extraction assistant. Your task is to analyze patient-provider conversations and extract key medical information in JSON format.

INSTRUCTIONS:
1. Read the conversation carefully
2. Extract three types of information:
   - "terms": Symptoms or general medical terms (e.g., "Pain, Chronic", "Upper Extremity Problem")
   - "conditions": Diagnoses or medical conditions (e.g., "Adenocarcinoma", "Neoplasms by Site")
   - "interventions": Treatments or procedures (e.g., "Hypofractionated radiation therapy", "blood sample", "Computed Tomography")
3. Only include information explicitly mentioned in the conversation
4. Return ONLY valid JSON in this exact format:

{
  "terms": ["term1", "term2"],
  "conditions": ["condition1", "condition2"],
  "interventions": ["intervention1", "intervention2"]
}

CRITICAL RULES:
- Output ONLY the JSON object, with no additional text, explanations, or markdown
- If a category has no items, use an empty array: []
- Do not include any text before or after the JSON
- Do not wrap the JSON in code blocks or markdown
- Ensure all strings are properly escaped
- Do not hallucinate or infer information not present in the conversation`;

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
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: prompt }],
    });

    console.log("!!!!! Claude done")
    console.log(msg);
    res.status(200).json({ response: msg.content });
  } catch (error) {
    console.error('Error calling Claude API:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}