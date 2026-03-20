export interface ApplicationDto {
  id: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  cvFileName: string;
  cvPath: string;
  status: string;
  compatibilityScore?: number;
  advantages: string[];
  disadvantages: string[];
  coverLetter?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateApplicationDto {
  jobId: string;
  cvId: string;
  coverLetter?: string;
}

export interface UpdateApplicationStatusDto {
  status: string;
}
