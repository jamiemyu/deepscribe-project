"use client";

import React, { useEffect, useState } from 'react';
import { Trial } from '@/app/components/TrialModel';
import { useParams } from 'next/navigation'

const TrialView: React.FC = () => {
    const params = useParams<{ trialId: string }>();

    const [trialId, setTrialId] = useState<string>('');
    const [trial, setTrial] = useState<Trial | null>(null);
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const getTrialById = async (trialId: string) => {
            try {
                const response = await fetch(`/api/trials/${trialId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                });
                const data = await response.json();
                setTrial(data);
            } catch (error) {
                console.error(`Error fetching ClinicalTrials study by ${trialId}: `, error);
                setError('Error: Could not get response from ClinicalTrials API.');
            } finally {
                setLoading(false);
            }
        };

        if (params?.trialId) {
            setTrialId(params.trialId);
            getTrialById(params.trialId);
        }
    }, []);

    if (error) {
        // TODO - implement error handling.
    }

    if (loading) {
        // TODO - implement loading handling.
    }


    const trialAsJson = JSON.stringify(trial, null, 2);
    return (
        <div className="p-6">
            <h2 className="p-2 self-start text-2xl font-bold text-white">Trial Details</h2>
            {trial &&
                <pre className="bg-gray-100 text-purple-700 p-4 rounded overflow-auto">
                    {trialAsJson}
                </pre>
            }
        </div>
    );
};

export default TrialView;