This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# ds-backend
Repository for hosting code for a backend used in the DeepScribe take-home interview

# Assignment

## Product Requirements
1. **Transcript Input**
    - Use a simulated transcript that includes relevant details like patient history, symptoms, treatment plans, etc.
    - The transcript should reflect a realistic patient/provider conversation. You can ask an LLM to generate one.
2. **Extract Patient Data via LLM**
    - Create a backend service that takes a transcript and extracts relevant structured data using an LLM.
    - Prompt an LLM of your choice (e.g., OpenAI, Gemini, Claude, etc.) to analyze the text.
3. **Find Clinical Trials Matches**
    - Use the publicly available API [ClinicalTrials.gov API](https://clinicaltrials.gov/data-api/api) to get a small set of relevant trials.
    - Use as much filtering criteria as can be extracted from the step above.
4. **Display the results**
    - Create a simple web-based (or mobile if preferred) interface to render clinical trial recommendations.
    - Make it easy to learn more about the specific trials.

## Technical Requirements
- **Full-Stack:** The application should have a backend (for handling the LLM and ClinicalTrials.gov API calls) and a frontend.
- **Language/Framework:** You are free to use any programming language and framework you are comfortable with (e.g., Python/Flask, Node.js/Express, React, Vue, etc.).
- **Documentation:** A `README.md` file is required. It must include:
    1. A brief overview of your approach.
    2. Deployed working demo (via Render, Vercel, AWS, etc).
    3. Clear, step-by-step instructions on how to set up and run the project locally.
    4. Any assumptions you made during development.

## Assessment Criteria
- **Functionality:** How well does the demo satisfy the core requirements?
- **Code Quality:** Is the code modular and maintainable?
- **User Experience:** Is the UI intuitive and responsive?
- **Creativity and Flexibility:** We encourage you to be creative. Feel free to expand on the basic requirements and take the feature in innovative directions. Consider using AI to make thoughtful judgement calls about missing patient data, or using it to rank the matched trials. Consider allowing the patient to save the list of trials for later or even ask questions about specific trials.

# Product Design

## System Architecture
The App Server follows a monolith design. A single API call from the client will handle:
- Input: Patient/provider transcript
- Output: Clinical Trials studies relevant to the transcript

Excalidraw sketch: 

The key business logic includes:
1. Transcript Extraction: Interact with external LLM backends in order to extract important structured data from a patient/provider conversation transcript.
2. Clinical Trial Search: Search for clinical trial data from external backends.
The benefit of this design means the business logic for these key steps are abstracted away behind units and kept as two "stages" of the flow. The actual technologies and capabilities can be swapped under the hood, but the inputs/outputs should remain consistent.

The rationale for monolith app instead of decoupled FE/BE microservices:
1. We do not intend (at the moment) to handle the key stages in separate client interactions yet. A single interaction on the client (uploading the transcript to search for trials) matches the single API request/response flow.
2. Microservices, while more maintainable and modular in nature, are heavier set-up at the start. If we need it soon, we can always refactor the business logic split into 2 chunks, into 2 microservices. In Django, this would be represented as 2 separate applications deployed together using some containerization mechanism.

## API

## Productionization Strategy
To bring this server beyond local development, we'll leverage Vercel for simple and easy deployment.

# Repository Details

## What
This is the Next.js Application used to host business logic used for a web application that takes in a patient/provider conversation transcript, and returns back a list of clinical trials that best match against the details described in the input.

The client uses React, Typescript, Tailwind CSS and is deployed using Vercel.

## How-to develop (on Mac OS)
IMPORTANT: A pre-requisite is the developer should have an up-to-date Node npm version installed.

### GitHub repository clone
Using tool of choice, clone this repository.

`git clone https://github.com/jamiemyu/deepscribe-project.git`

### Virtual Environment setup
In order to develop, it's preferable to [set up a virtual environment](https://www.w3schools.com/django/django_create_virtual_environment.php) where all required installations are neatly available.
1. `$python -m venv {ENVIRONMENT_NAME}`
2. `source {ENVIRONMENT_NAME}/bin/activate`

### How-to run
1. Start the server locally: ``
2. Navigate to the local host/port (also printed out in the terminal)
3. To adjust the local host/port, modify 
