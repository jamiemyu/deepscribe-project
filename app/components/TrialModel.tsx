enum TrialStatus {
    TRIAL_STATUS_COMPLETED = "Completed",
    TRIAL_STATUS_RECRUITING = "Recruiting",
    TRIAL_STATUS_TERMINATED = "Terminated",
}

export interface Trial {
    title: string;
    nctId: string;
    status: TrialStatus;
    hasResults: boolean;
}

export {
    TrialStatus
}