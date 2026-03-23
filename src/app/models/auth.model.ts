import { UserDto } from './user.model';

export interface LoginRequest {
  email: string;
  passwordHash: string; // The backend uses 'PasswordHash' but let's check LoginRequestDto
}

// Actually, I should match the backend exactly. 
// LoginRequestDto.cs: Email, Password
// RegisterRequestDto.cs: Email, Password, ConfirmPassword, UserType, FirstName, LastName, CompanyName

export interface LoginRequestDto {
  email: string;
  password: string;
}

export interface RegisterRequestDto {
  email: string;
  password: string;
  confirmPassword: string;
  userType: number; // Enum UserType { Candidate = 0, Company = 1 }
  firstName?: string;
  lastName?: string;
  companyName?: string;
}

export interface AuthResponseDto {
  token: string;
  refreshToken?: string;
  user: UserAuthDto;
}

export interface UserAuthDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  createdAt: string;
}
