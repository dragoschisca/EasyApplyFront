export interface UserDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  createdAt: Date;
}

export interface CreateUserDto {
  email: string;
  passwordHash: string; // The UI might send 'password', but mapping it loosely for registration
  firstName: string;
  lastName: string;
  role: string;
}

export interface UpdateUserDto {
  firstName: string;
  lastName: string;
}
