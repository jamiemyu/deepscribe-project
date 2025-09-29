"use client";

import React, { useEffect, useState } from 'react';

import InputForm from './components/InputForm';
import TrialsList from './components/TrialsList';
import { convertClinicalApiResponseToTrials, Trial, TrialStatus } from './components/TrialModel';

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
    return data;
  };

  const callClinicalTrialsApi = async (llmResponse: string) => {
    const response = await fetch('/api/clinicaltrials', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(llmResponse),
    });
    const data = await response.json();
    return data;
  };

  const handlePromptChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrompt(e.target.value);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let llmResponse = "";
    try {
      const data = await callClaudeApi();
      if (data && data.response.length > 0) {
        llmResponse = data.response[0].text;
      }
    } catch (error) {
      console.error('Error fetching Claude response:', error);
      setError('Error: Could not get response from Claude.');
    } finally {
      setLoading(false);
    }

    setLoading(true);
    try {
      const data = await callClinicalTrialsApi(llmResponse);
      if (data == undefined) {
        setError('Error: Empty response from Clinical Trials API');
      } else {
        const trials = convertClinicalApiResponseToTrials(data);
        console.log(trials);
        setTrials(trials);
      }
    } catch (error) {
      console.error('Error fetching ClinicalTrials response:', error);
      setError('Error: Could not get response from ClinicalTrials API.');
    } finally {
      setLoading(false)
    }
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