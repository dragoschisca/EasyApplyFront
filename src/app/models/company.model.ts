export interface CompanyDto {
  id: string;
  userId: string;
  companyName: string;
  industry?: string;
  companySize?: string;
  website?: string;
  description?: string;
  logoUrl?: string;
  location?: string;
  companyCulture?: string;
  email: string;
  subscriptionTier: number;
  subscriptionExpiresAt?: Date;
  activeJobsCount: number;
  createdAt: Date;
}

export interface CreateCompanyDto {
  companyName: string;
  industry?: string;
  companySize?: string;
  website?: string;
  description?: string;
  logoUrl?: string;
  location?: string;
  companyCulture?: string;
}

export interface UpdateCompanyDto {
  companyName: string;
  industry?: string;
  companySize?: string;
  website?: string;
  description?: string;
  logoUrl?: string;
  location?: string;
  companyCulture?: string;
}
