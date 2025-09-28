"use client";

import React, { useEffect, useState } from 'react';

import InputForm from './components/InputForm';
import TrialsList from './components/TrialsList';
import { Trial, TrialStatus } from './components/TrialModel';

const getTrials = () => {
  const trial1: Trial = {
      nctId: 'NCT03540771',
      title: 'Introducing Palliative Care (PC) Within the Treatment of End Stage Liver Disease (ESLD)',
      status: TrialStatus.TRIAL_STATUS_COMPLETED,
      hasResults: false,
  };
  const trial2: Trial = {
      nctId: 'NCT03630471',
      title: 'Effectiveness of a Problem-solving Intervention for Common Adolescent Mental Health Problems in India',
      status: TrialStatus.TRIAL_STATUS_COMPLETED,
      hasResults: false,
  };
  const trial3: Trial = {
      nctId: 'NCT00587795',
      title: 'Orthopedic Study of the Aircast StabilAir Wrist Fracture Brace',
      status: TrialStatus.TRIAL_STATUS_TERMINATED,
      hasResults: true,
  };

  return [trial1, trial2, trial3];
};

export default function Page() {
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const [prompt, setPrompt] = useState<string>('');
  const [llmResponse, setLlmResponse] = useState<string>('');

  const [trials, setTrials] = useState<Array<Trial>>([]);

  const callClaudeApi = async () => {
    const response = await fetch('/api/claude', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });
    const data = await response.json();

    if (data == undefined || data.response.length == 0) {
      setError('Error: Empty response from Claude.');
    } else {
      setLlmResponse(data.response[0].text);
    }
  };

  const callClinicalTrialsApi = async () => {
    const conditions = "";
    const terms = "";
    const response = await fetch('/api/clinicaltrials', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      //body: JSON.stringify({ conditions, terms }),
    });
    const data = await response.json();

    if (data == undefined) {
      setError('Error: Empty response from Clinical Trials API');
    } else {
      // TODO Plumb through real data.
      let trials = getTrials();
      setTrials(trials);
    }
  };

  const fetchChainedData = async () => {
    try {
      console.log('Calling Claude...');
      await callClaudeApi();
      console.log('Claude call completed!');

      console.log('Calling clinical trials API...');
      await callClinicalTrialsApi();
      console.log('Clinical Trials API call completed!');

    } catch (error) {
      console.error('Error fetching Claude response:', error);
      setError('Error: Could not get response from Claude.');
    } finally {
      setLoading(false);
    }
  };

  const handlePromptChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrompt(e.target.value);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    await fetchChainedData();
  };

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <InputForm onPromptChange={handlePromptChange}
                   onFormSubmit={handleFormSubmit}
                   prompt={prompt}
                   loading={loading} />
        <TrialsList trials={trials} />
      </main>
    </div>
  );
}