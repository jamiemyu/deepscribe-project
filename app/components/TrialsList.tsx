
import React from 'react';
import { getStatusColor, Trial } from './TrialModel';

interface TrialsListProps {
    trials: Array<Trial>;
    onTrialClick: React.MouseEventHandler;
}

const TrialsList: React.FC<TrialsListProps> = ({ trials, onTrialClick }) => {
    const renderMatches = (word: string) => (
      <span key={word} className={`inline-flex py-1 text-xs text-gray-700 rounded-full text-start`}>
        "{word.toLowerCase()}"
      </span>
    );

    const renderTrial = (trial: Trial) => (
      <tr onClick={onTrialClick} key={trial.nctId} data-item-id={trial.nctId} className="hover:bg-gray-50">
        <td className="px-6 py-4 text-sm text-gray-900 border-b border-gray-100">
            {trial.title}
        </td>
        <td className="px-6 py-4 text-sm border-b border-gray-100">
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full text-center ${trial.status && getStatusColor(trial.status)}`}>
            {trial.status}
            </span>
        </td>
        {trial.matchedConditions && trial.matchedConditions.length > 0 ?
          <td className="p-2 border-b border-gray-100">
              {trial.matchedConditions.map(renderMatches)}
          </td> :
          <td className="p-2 border-b border-gray-100"></td>
          }
        {trial.matchedTerms && trial.matchedTerms.length > 0 ?
          <td className="p-2 border-b border-gray-100">
              {trial.matchedTerms.map(renderMatches)}
          </td> :
          <td className="p-2 border-b border-gray-100"></td>
          }
        {trial.matchedInterventions && trial.matchedInterventions.length > 0 ?
          <td className="p-2 border-b border-gray-100">
              {trial.matchedInterventions.map(renderMatches)}
          </td> :
          <td className="p-2 border-b border-gray-100"></td>
          }
      </tr>
    );

    return (
      <div>
        <div className="overflow-x-auto rounded-lg">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                  Trial
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                  Status
                </th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                  Related conditions
                </th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                  Related terms
                </th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                  Related interventions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {trials.map(renderTrial)}
            </tbody>
          </table>
        </div>
      </div>
    );
};

export default TrialsList;