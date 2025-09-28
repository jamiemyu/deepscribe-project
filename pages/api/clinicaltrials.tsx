import type { NextApiRequest, NextApiResponse } from 'next';
import type { ClinicalTrialsApiResponse, ClinicalTrialsStudy } from './ClinicalTrialsModel';

const CLINICAL_TRIALS_STUDIES_API_ENDPOINT = "https://clinicaltrials.gov/api/v2/studies";

/**
 * Interface for the function parameters
 */
type UrlBuilderParams = {
    baseUrl: string;
    conditions: string[];
    terms: string[];
    format?: string;
};

/**
 * Helper function to build a URL with query parameters for format and query.cond
 * 
 * @param baseUrl - The base URL to append query parameters to
 * @param conditions - Array of condition strings to concatenate with essie expression syntax
 * @param terms - Array of term strings to concatenate with essie expression syntax
 * @param format - Optional format parameter (defaults to 'json')
 * @returns Complete URL with query parameters
 */
export function buildUrl({
    baseUrl,
    conditions,
    terms,
    format = 'json'
  }: UrlBuilderParams): string {
    // Remove trailing slash from baseUrl if present
    const cleanBaseUrl = baseUrl.replace(/\/$/, '');
    
    // Create URLSearchParams to properly encode query parameters
    const params = new URLSearchParams();
    
    // Add format parameter
    params.append('format', format);
    
    // Concatenate conditions using essie expression syntax (AND operator)
    if (conditions.length > 0) {
      const concatenatedConditions = conditions
        .filter(condition => condition.trim() !== '') // Remove empty conditions
        .map(condition => condition.trim())
        .join(' AND ');
      
      if (concatenatedConditions) {
        params.append('query.cond', concatenatedConditions);
      }
    }

    // Concatenate terms using essie expression syntax (AND operator)
    if (terms.length > 0) {
      const concatenatedTerms = terms
        .filter(term => term.trim() !== '') // Remove empty conditions
        .map(term => term.trim())
        .join(' AND ');
      
      if (concatenatedTerms) {
        params.append('query.term', concatenatedTerms);
      }
    }
    
    // Build final URL
    return `${cleanBaseUrl}?${params.toString()}`;
  }

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  /*if (req.method !== 'POST') {
    return res.status(405).json({ message: 'POST Method required, ' + req.method + ' Not Allowed' });
  }*/

  //const { conditions, terms } = await req.body;
  const conditions = [""];
  const terms = [""];

  /*if (!prompt) {
    return res.status(400).json({ message: 'User prompt is required' });
  }*/

  try {
    const response = await fetch(buildUrl({baseUrl: CLINICAL_TRIALS_STUDIES_API_ENDPOINT, conditions, terms}));

    if (!response.ok) {
        throw new Error(`ClinicalTrials.gov API responded with status ${response.status}`);
    }

    const data: ClinicalTrialsApiResponse = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error calling Claude API:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
