
export interface ClinicalTrialsQueryTerms {
    conditions: string[],
    terms: string[],
    interventions: string[],
}

export interface IdentificationModule {
    nctId: string,
    briefTitle: string,
}

export interface StatusModule {
    overallStatus: string,
}

export interface ProtocolSection {
    identificationModule: IdentificationModule,
    statusModule: StatusModule,
}

export interface DocumentSection {
    // TODO - Implement strict typing
}

export interface DerivedSection {
    // TODO - Implement strict typing
}

export interface ClinicalTrialsStudy {
    protocolSection: ProtocolSection,
    documentSection: DocumentSection,
    derivedSection: DerivedSection,
    hasResults: boolean;
}

export interface ClinicalTrialsApiResponse {
    studies: ClinicalTrialsStudy[],
}