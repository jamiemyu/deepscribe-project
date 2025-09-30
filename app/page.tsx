"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import UploadForm from './components/UploadForm';
import TrialsList from './components/TrialsList';
//import TrialView from './trials/page';
import { convertClinicalApiResponseToTrials, Trial } from './components/TrialModel';

export default function Page() {
  const router = useRouter();
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [complete, setComplete] = useState<boolean>(false);

  const [file, setFile] = useState<File | null>(null);
  const [trials, ] = useState<Map<string, Trial> | null>(null);
  const [, setTrial] = useState<Trial | null>(null);

  const callClaudeExtractMetadataApi = async (prompt: string) => {
    const response = await fetch('/api/claude/extractmetadata', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });
    const data = await response.json();
    return data;
  };

  const callClaudeRerankStudiesApi = async (trials: Map<string, Trial>, extractedMetadata: string) => {
    const response = await fetch('/api/claude/rerankstudies', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ trials, extractedMetadata }),
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

      reader.onload = () => {
        if (reader.result) {
          resolve(reader.result as string);
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };

      reader.readAsText(file);
    });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (file == null) {
      handleFormReset();
      console.error('Valid .txt file must be uploaded.');
      return;
    }
    const prompt = await processFile(file);

    let extractedMetadata = "";
    try {
      // TODO - Implement AI thought process streamed to the client. This way, the user can see
      // why the processing is taking time.
      const data = await callClaudeExtractMetadataApi(prompt);
      if (data && data.response.length > 0) {
        extractedMetadata = data.response[0].text;
      }
    } catch (error) {
      console.error('Error fetching Claude response:', error);
      setError('Error: Could not get response from Claude.');
    } finally {
      setLoading(false);
    }

    setLoading(true);
    let trials = new Map<string, Trial>();
    try {
      const data = await callClinicalTrialsApi(extractedMetadata);
      if (data == undefined) {
        setError('Error: Empty response from Clinical Trials API');
      } else {
        trials = convertClinicalApiResponseToTrials(data);
      }
    } catch (error) {
      console.error('Error fetching ClinicalTrials response:', error);
      setError('Error: Could not get response from ClinicalTrials API.');
    } finally {
      setLoading(false);
    }

    setLoading(true);
    try {
      const rerankedStudies = await callClaudeRerankStudiesApi(trials, extractedMetadata);
      if (rerankedStudies == undefined) {
        setError('Error: Empty response from Claude API');
      } else {
        // const trials: Trial[] = JSON.parse(rerankedStudies);
        // Get top 10?
        // setTrials
      }
    } catch (error) {
      console.error('Error fetching ClinicalTrials response:', error);
      setError('Error: Could not get response from ClinicalTrials API.');
    } finally {
      setLoading(false);
    }
  };

  const handleTrialClick = async (e: React.MouseEvent) => {
    const targetElement = e.currentTarget as HTMLElement;
    if (targetElement && targetElement.dataset) {
      const trialId = targetElement.dataset.itemId;
      if (trialId && trials) {
        const trial: Trial = trials.get(trialId) as Trial;
        setTrial(trial);
        router.push(`/trials/${trialId}`);
      }
    }
  };

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-10">
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
    </div>
  );
}