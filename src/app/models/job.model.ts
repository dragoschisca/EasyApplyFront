export interface JobDto {
  id: string;
  companyId: string;
  companyName: string;
  companyLogoUrl?: string;
  title: string;
  category: string;
  description: string;
  requirements: string;
  requiredSkills: string[];
  employmentType: string;
  experienceLevel: string;
  locationType: number;
  latitude?: number;
  longitude?: number;
  location?: string;
  address?: string;
  companyCulture?: string;
  salaryMin?: number;
  salaryMax?: number;
  isActive: boolean;
  viewsCount: number;
  applicationsCount: number;
  createdAt: Date;
  expiresAt?: Date;
}

export interface CreateJobDto {
  title: string;
  category: string;
  description: string;
  requirements: string;
  location: string;
  locationType: number;
  latitude?: number;
  longitude?: number;
  address?: string;
  companyCulture?: string;
  employmentType: string;
  experienceLevel: string;
  salaryMin?: number;
  salaryMax?: number;
  companyId: string;
  isActive: boolean;
  expiresAt?: Date;
}

export interface UpdateJobDto {
  title: string;
  category?: string;
  description: string;
  requirements: string;
  location: string;
  locationType?: number;
  latitude?: number;
  longitude?: number;
  address?: string;
  companyCulture?: string;
  employmentType: string;
  experienceLevel: string;
  salaryMin?: number;
  salaryMax?: number;
  isActive: boolean;
  expiresAt?: Date;
}
