"use client";

import React, { useEffect, useState } from 'react';

import UploadForm from './components/UploadForm';
import TrialsList from './components/TrialsList';
import { convertClinicalApiResponseToTrials, Trial } from './components/TrialModel';

export default function Page() {
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [complete, setComplete] = useState<boolean>(false);

  const [file, setFile] = useState<File | null>(null);
  const [trials, setTrials] = useState<Array<Trial>>([]);

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

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-10">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1 className="text-2xl font-bold text-white">Clinical Trials Finder</h1>
        <UploadForm onFileChange={handleFileChange}
                    onReset={handleFormReset}
                    onSubmit={handleFormSubmit}
                    file={file}
                    error={error}
                    loading={loading}
                    complete={complete}/>
        {trials.length > 0 && <TrialsList trials={trials} />}
      </main>
    </div>
  );
}