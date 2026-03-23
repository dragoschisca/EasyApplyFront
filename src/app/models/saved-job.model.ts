import { JobDto } from './job.model';

export interface SavedJobDto {
  id: string;
  candidateId: string;
  jobId: string;
  savedAt: Date;
  job?: JobDto;
}
