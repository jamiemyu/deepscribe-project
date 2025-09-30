"use client"

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Trial } from '@/app/components/TrialModel';

const TrialView: React.FC = () => {
    const { id } = useParams();
    const [trial, setTrial] = useState<Trial | null>(null);
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const getTrialById = async () => {
            try {
                const response = await fetch('/api/trials/${trialId}', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                });
                const data = await response.json();
                setTrial(data);
            } catch (error) {
                console.error('Error fetching ClinicalTrials study by ${trialId}: ', error);
                setError('Error: Could not get response from ClinicalTrials API.');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            getTrialById();
        }
    }, [id]);

    if (error) {
        // TODO - implement error handling.
    }

    if (loading) {
        // TODO - implement loading handling.
    }

    console.log("!!!!!!!!");
    console.log(trial);
    return (
        <div className="p-6">
            Hello world!
            {trial &&
                <div>
                    {trial.hasResults}
                </div>
            }
        </div>
    );
};

export default TrialView;