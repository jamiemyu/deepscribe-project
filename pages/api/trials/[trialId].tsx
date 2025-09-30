import type { NextApiRequest, NextApiResponse } from 'next';

const CLINICAL_TRIALS_STUDIES_API_ENDPOINT = "https://clinicaltrials.gov/api/v2/studies/{{id}}";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = await req.query;

  if (typeof id !== 'string') {
    return res.status(400).json({ message: 'Invalid ID provided.' });
  }

  try {
    if (req.method === 'GET') {
        const clinicalTrialsUrl = CLINICAL_TRIALS_STUDIES_API_ENDPOINT
            .replace("{{id}}", id);
        const response = await fetch(clinicalTrialsUrl);

        if (!response.ok) {
            throw new Error(`ClinicalTrials.gov API responded with status ${response.status}`);
        }

        const data = await response.json();
        res.status(200).json(data);
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
  } catch (error) {
    console.error('Error calling Clinical Trials API:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}