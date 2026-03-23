export interface CandidateDto {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phone?: string;
  location?: string;
  linkedInUrl?: string;
  gitHubUrl?: string;
  portfolioUrl?: string;
  bio?: string;
  email: string;
  cvsCount: number;
  applicationsCount: number;
  createdAt: Date;
}

export interface CreateCandidateDto {
  firstName: string;
  lastName: string;
  phone?: string;
  location?: string;
  bio?: string;
  linkedInUrl?: string;
  gitHubUrl?: string;
  portfolioUrl?: string;
}

export interface UpdateCandidateDto {
  firstName: string;
  lastName: string;
  phone?: string;
  location?: string;
  bio?: string;
  linkedInUrl?: string;
  gitHubUrl?: string;
  portfolioUrl?: string;
}
