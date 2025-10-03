# About
Repository for hosting code used in the DeepScribe take-home assignment. This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app). It hosts the business logic used for a web application that takes in a patient/provider conversation transcript, and returns back a list of clinical trials that best match against the details described in the input.

The client uses React, Typescript, Tailwind CSS and is deployed using Vercel.

**To access the production site, you can visit: https://deepscribe-project.vercel.app/.**

Related Links:
*   [Vercel project](https://vercel.com/jamiemyus-projects)

# How-to: **local development** (on Mac OS)
IMPORTANT: A pre-requisite is the developer should have an up-to-date Node npm version installed.

## Step 1: Clone GitHub repository:
Using tool of choice, clone [this repository](https://github.com/jamiemyu/deepscribe-project.git).

e.g., `git clone https://github.com/jamiemyu/deepscribe-project.git`

## Step 2: Run a local server:
Start the server locally:

```bash
npm run build
npm run dev
```

## Step 3: Open the local server in web:
Navigate to [http://localhost:3000](http://localhost:3000) with your browser to see the result.

The repository contains the example files that can be used to test the application: `SyntheticConversation1.txt`, `SyntheticConversation2.txt`. Alternatively, you can use (and/or modify) the Prompt used to generate synthetic patient/provider conversations using `PromptSyntheticConversation.md` (the examples above used this prompt with Claude, but Gemini and ChatGPT are other options).

[Home page](./public/home-page-demo.png)

[Details page](./public/details-page-demo.png)

# Implementation Overview
The App Server follows a monolith design. A single API call from the client will handle:
- Input: Patient/provider transcript
- Output: Clinical Trials studies relevant to the transcript

The key business logic includes:
1. Transcript Extraction: Interact with external LLM backends in order to extract important structured data from a patient/provider conversation transcript.
2. Clinical Trial Search: Search for clinical trial data from external backends.
3. Relevancy Ranking: Interact with external LLM backends in order to compute a "relevance score" for each clinical trial found, based on how well they match against the extracted inputs.
    -   Edge case: If this API call fails, we fallback to the unranked clinical trials.
4. Trial details: Shows the details for a given trial.

The benefit of this design means the business logic for these key steps are abstracted away behind units and kept as three "stages" of the flow. The actual technologies and capabilities can be swapped under the hood, but the inputs/outputs should remain consistent.

## API
We use API routes to define each external API:
1. `extractmetadata.tsx`: Extracts metadata from a patient/provider conversation.
2. `clinicaltrials.tsx`: Fetches a list of studies that match a set of extracted metadata.
3. `rerankstudies.tsx`: Re-ranks a list of studies based on relevance to a set of extracted metadata.
4. `[trialId].tsx`: Fetches details for a given `trialId` from Clinical Studies API.

## Product Assumptions
*   The patient/provider conversations should mention 3 important aspects: conditions, terms, and interventions. These are extracted, and anything else is currently excluded.
*   The user prefers to see most relevant trials and does not need to see _all trials_/pages of trials (pagination not implemented).
*   The user only needs to see some important metadata (trial's name, trial's status) before clicking into a trial to see more details.
*   This application is to be used on Desktop (UI is not optimized for Mobile yet!)

## System Assumptions
*   The _size_ of the patient/provider conversation input should be small enough to fit within the API limits aka Claude's maximum tokens requirement (200,000).
*   Given we are using LLMs for two steps (metadata extraction, ranking) there is going to be latency. We can afford some latency in this application.

## TODOs (If I had more time to work on this!)
* [ ]   **Improve extraction details.** Currently, the prompt asks Claude to pull out key terms, conditions, and interventions mentioned in the patient/provider conversation. While these are 3 useful details used to query the Clinical Trials API, there are other query terms that could be useful to help improve the search.
* [ ]   **Evaluation.** Currently, there are several prompts used for key interactions with LLMs (Generating the synthetic patient/provider conversations, extracting key information from the conversations, calculating relevance and re-ranking studies). I didn't spend a lot of time evaluating the quality of the responses and it would be great to perform evaluation to assess for things like overfitting, hallucinations, etc. Additionally, we are currently testing these prompts with a single model/backend (Claude) but it could be worth using the same prompts with different model/backends (Gemini, ChatGPT APIs) to see how they perform.
* [ ]   **Implement details view.** Currently, clicking on any trial from the main page list will route to a new page for showing the trial's details. Ideally we format the structured data in the UI.
* [ ]   **Implement filtering & sorting.** It would be nice for the results list to have filter and sort-by functionality. E.g., if the user wants to click on the "Status" column, we should be able to re-rank the results list based on Status. For filtering, if the user wants to filter by "Recruiting" status, we should be able to render the results list with only studies with "Recruiting" status.