
import React, { useState } from 'react';
import { Trial, TrialStatus } from './TrialModel';

interface TrialViewProps {
    trial: Trial;
}

const TrialView: React.FC<TrialViewProps> = ({ trial }) => {
    return (
        <div>
            {trial.nctId}
        </div>
    );
};

export default TrialView;