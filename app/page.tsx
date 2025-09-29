"use client";

import React, { useEffect, useState } from 'react';

import UploadForm from './components/UploadForm';
import TrialsList from './components/TrialsList';
import TrialView from './components/TrialView';
import { convertClinicalApiResponseToTrials, Trial } from './components/TrialModel';

export default function Page() {
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [complete, setComplete] = useState<boolean>(false);

  const [file, setFile] = useState<File | null>(null);
  const [trials, setTrials] = useState<Map<string, Trial> | null>(null);
  const [trial, setTrial] = useState<Trial | null>(null);

  const callClaudeApi = async (prompt: string) => {
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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
        return;
    }

    const selectedFile = e.target.files[0];
    setError('');
    setComplete(false);

    if (selectedFile) {
      if (selectedFile.type === 'text/plain' || selectedFile.name.endsWith('.txt')) {
          setFile(selectedFile);
      } else {
          setError('Please select a .txt file');
          setFile(null);
          e.target.value = '';
      }
    }
  };

  const handleFormReset = () => {
      setComplete(false);
      setError('');
  };

  const processFile = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e: ProgressEvent) => {
        if (reader.result) {
          resolve(reader.result as string);
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };

      reader.readAsText(file);
    });
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (file == null) {
      handleFormReset();
      console.error('Valid .txt file must be uploaded.');
      return;
    }
    const prompt = await processFile(file);

    let llmResponse = "";
    try {
      const data = await callClaudeApi(prompt);
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
        setTrials(trials);
      }
    } catch (error) {
      console.error('Error fetching ClinicalTrials response:', error);
      setError('Error: Could not get response from ClinicalTrials API.');
    } finally {
      setLoading(false)
    }
  };

  const handleTrialClick = async (e: React.MouseEvent) => {
    const targetElement = e.currentTarget as HTMLElement;
    if (targetElement && targetElement.dataset) {
      const trialId = targetElement.dataset.itemId;
      if (trialId && trials) {
        const trial: Trial = trials.get(trialId) as Trial;
        setTrial(trial);
      }
    }
  };

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-10">
        {trial ?
          <TrialView trial={trial} />
        :
          <main className="flex flex-col gap-[16px] row-start-2 items-center sm:items-start">
            <h1 className="self-start text-2xl font-bold text-white">Clinical Trials Finder</h1>
            <UploadForm onFileChange={handleFileChange}
                        onReset={handleFormReset}
                        onSubmit={handleFormSubmit}
                        file={file}
                        error={error}
                        loading={loading}
                        complete={complete}/>
            {trials && trials.size > 0 && 
              <div>
                <h2 className="mb-4 text-2xl font-bold text-white">{trials.size} Related Clinical Trials</h2>
                <TrialsList trials={Array.from(trials.values())} onTrialClick={handleTrialClick} />
              </div>
            }
          </main>
        }
    </div>
  );
}