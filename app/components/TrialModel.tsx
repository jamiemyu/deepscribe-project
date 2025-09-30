interface ClinicalTrialsApiResponse {
    studies: ClinicalTrialsStudy[],
}

interface OrgStudyIdInfo {
    id: string,
}

interface IdentificationModule {
    nctId: string,
    briefTitle: string,
    orgStudyIdInfo: OrgStudyIdInfo,
    organization: Identity,
}

interface DateStruct {
    date: string,
    type: string,
}

interface StatusModule {
    overallStatus: string,
    whyStopped: string,
    statusVerifiedDate: string,
    startDateStruct: DateStruct,
    completionDateStruct: DateStruct,
}

interface Identity {
    name: string,
    title: string,
}

interface SponsorCollaboratorsModule {
    leadSponsor: Identity,
    responsibleParty: Identity,
    collaborators: Identity[],
}

interface ProtocolSection {
    identificationModule: IdentificationModule,
    statusModule: StatusModule,
    sponsorCollaboratorsModule: SponsorCollaboratorsModule,
}

interface ClinicalTrialsStudy {
    protocolSection: ProtocolSection,
    hasResults: boolean;
}

enum TrialStatus {
    TRIAL_STATUS_UNKNOWN = "Unknown",
    TRIAL_STATUS_ACTIVE_NOT_RECRUITING = "Active Not Recruiting",
    TRIAL_STATUS_COMPLETED = "Completed",
    TRIAL_STATUS_RECRUITING = "Recruiting",
    TRIAL_STATUS_TERMINATED = "Terminated",
}

export interface Trial {
    title: string;
    nctId: string;
    status?: TrialStatus;
    hasResults: boolean;
    protocolSection: ProtocolSection;
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

function toTrialsMap(trials: Trial[]): Map<string, Trial> {
    const trialsMap: Map<string, Trial> = new Map<string, Trial>();

    for (const trial of trials) {
        const protocolSection = trial.protocolSection;
        const title = protocolSection.identificationModule.briefTitle;
        const nctId = protocolSection.identificationModule.nctId;
        const status = convertToTrialStatus(protocolSection.statusModule.overallStatus);
        const hasResults = trial.hasResults;
        if (!title || !nctId) {
            console.warn("convertClinicalApiResponseToTrials: study is missing fields but requires: title, id");
        }

        trialsMap.set(nctId, {title, nctId, status, hasResults, protocolSection});
    }
    return trialsMap;
}

function convertClinicalApiResponseToTrials(apiResponse: ClinicalTrialsApiResponse): Map<string, Trial> {
    const trials: Map<string, Trial> = new Map<string, Trial>();
    const studies: ClinicalTrialsStudy[] = apiResponse.studies;

    for (const study of studies) {
        const protocolSection = study.protocolSection;
        const title = protocolSection.identificationModule.briefTitle;
        const nctId = protocolSection.identificationModule.nctId;
        const status = convertToTrialStatus(protocolSection.statusModule.overallStatus);
        const hasResults = study.hasResults;
        if (!title || !nctId) {
            console.warn("convertClinicalApiResponseToTrials: study is missing fields but requires: title, id");
        }

        const trial = {title, nctId, status, hasResults, protocolSection};
        trials.set(nctId, trial);
    }

    return trials;
}

function getStatusColor(status: TrialStatus = TrialStatus.TRIAL_STATUS_UNKNOWN) {
    switch (status) {
        case TrialStatus.TRIAL_STATUS_ACTIVE_NOT_RECRUITING:
        return 'bg-orange-100 text-orange-800';
        case TrialStatus.TRIAL_STATUS_COMPLETED:
        return 'bg-green-100 text-green-800';
        case TrialStatus.TRIAL_STATUS_RECRUITING:
        return 'bg-blue-100 text-blue-800';
        case TrialStatus.TRIAL_STATUS_TERMINATED:
        return 'bg-red-100 text-red-800';
        default:
        return 'bg-gray-100 text-gray-800';
    }
}

export {
    convertClinicalApiResponseToTrials,
    getStatusColor,
    toTrialsMap,
    TrialStatus,
};