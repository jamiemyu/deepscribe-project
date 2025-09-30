import type { NextApiRequest, NextApiResponse } from 'next';

const CLINICAL_TRIALS_STUDIES_API_ENDPOINT = "https://clinicaltrials.gov/api/v2/studies";
const PAGE_SIZE = 10;
const OR_OPERAND = ' OR ';

interface ClinicalTrialsQueryTerms {
    conditions: string[],
    terms: string[],
    interventions: string[],
}

/**
 * Represents the URL query parameters.
 */
type UrlBuilderParams = {
    baseUrl: string;
    queryTerms?: ClinicalTrialsQueryTerms;
    pageSize: number;
    format?: string;
};

/**
 * Builds a URL with query parameters.
 * 
 * @param baseUrl - The base URL to append query parameters to.
 * @param queryTerms - The structured data used for querying.
 * @param format - String literal for the format requested.
 * @returns Complete URL with query parameters
 */
function buildUrl({
    baseUrl,
    queryTerms,
    pageSize = 10,
    format = 'json'
  }: UrlBuilderParams): string {
    // Remove trailing slash from baseUrl if present.
    const cleanBaseUrl = baseUrl.replace(/\/$/, '');
    
    // Create URLSearchParams to properly encode query parameters.
    const params = new URLSearchParams();
    
    params.append('format', format);
    params.append('pageSize', pageSize.toString());
    
    // Add query parameters.
    if (queryTerms) {
        if (queryTerms.conditions && queryTerms.conditions.length > 0) {
            const concatenatedConditions = concatenate(queryTerms.conditions, OR_OPERAND);
            if (concatenatedConditions) {
                params.append('query.cond', concatenatedConditions);
            }
        }

        if (queryTerms.terms && queryTerms.terms.length > 0) {
            const concatenatedTerms = concatenate(queryTerms.terms, OR_OPERAND);
            if (concatenatedTerms) {
                params.append('query.term', concatenatedTerms);
            }
        }

        if (queryTerms.interventions && queryTerms.interventions.length > 0) {
            const concatenatedTerms = concatenate(queryTerms.interventions, OR_OPERAND);
            if (concatenatedTerms) {
                params.append('query.intr', concatenatedTerms);
            }
        }
    }

    return `${cleanBaseUrl}?${params.toString()}`;
  }

/** 
 * Concatenates phrases using essie expression syntax and the provided join operation.
 * 
 * @param words - Array of words to concatenate with essie expression syntax.
 * @param joiner - String literal for the join operation.
 */
function concatenate(words: string[], joiner: string) {
    return words
        .filter(word => word.trim() !== '') // Remove empty conditions
        .map(word => word.trim())
        .join(joiner);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const body = await req.body;
  const queryTerms: ClinicalTrialsQueryTerms = JSON.parse(body);

  try {
    const clinicalTrialsUrl = buildUrl({baseUrl: CLINICAL_TRIALS_STUDIES_API_ENDPOINT, pageSize: PAGE_SIZE, queryTerms});
    const response = await fetch(clinicalTrialsUrl);

    if (!response.ok) {
        throw new Error(`ClinicalTrials.gov API responded with status ${response.status}`);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error calling Clinical Trials API:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

export const config = {
    api: {
        responseLimit: false,
    },
}