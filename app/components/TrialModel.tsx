import { ClinicalTrialsApiResponse, ClinicalTrialsStudy } from "@/pages/api/ClinicalTrialsModel";

enum TrialStatus {
    TRIAL_STATUS_UNKNOWN = "Unknown",
    TRIAL_STATUS_ACTIVE_NOT_RECRUITING = "Active Not Recruiting",
    TRIAL_STATUS_COMPLETED = "Completed",
    TRIAL_STATUS_RECRUITING = "Recruiting",
    TRIAL_STATUS_TERMINATED = "Terminated",
}

function convertToTrialStatus(status: string): TrialStatus {
    switch (status) {
        case "ACTIVE_NOT_RECRUITING":
            return TrialStatus.TRIAL_STATUS_ACTIVE_NOT_RECRUITING;
        case "COMPLETED":
            return TrialStatus.TRIAL_STATUS_COMPLETED;
        case "RECRUITING":
            return TrialStatus.TRIAL_STATUS_RECRUITING;
        case "TERMINATED":
            return TrialStatus.TRIAL_STATUS_TERMINATED;
        default:
            return TrialStatus.TRIAL_STATUS_UNKNOWN;
    }

}

export interface Trial {
    title: string;
    nctId: string;
    status?: TrialStatus;
    hasResults: boolean;
}

function convertClinicalApiResponseToTrials(apiResponse: ClinicalTrialsApiResponse): Trial[] {
    const trials: Trial[] = [];
    const studies: ClinicalTrialsStudy[] = apiResponse.studies;

    for (const study of studies) {
        const title = study.protocolSection.identificationModule.briefTitle;
        const nctId = study.protocolSection.identificationModule.nctId;
        const status = convertToTrialStatus(study.protocolSection.statusModule.overallStatus);
        const hasResults = study.hasResults;
        if (!title || !nctId) {
            console.warn("convertClinicalApiResponseToTrials: tudy is missing fields but requires: title, id");
        }

        const trial = {title, nctId, status, hasResults};
        trials.push(trial);
    }

    return trials;
}

export {
    convertClinicalApiResponseToTrials,
    TrialStatus,
}