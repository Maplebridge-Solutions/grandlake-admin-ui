export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  roles: string[];
}

export interface Profile {
  _id: string;
  firstName: string;
  lastName: string;
  userId: string;
  isDriver: boolean;
  phone?: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface User {
  _id: string;
  email: string;
  roles?: string[];
  role?: string;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

// The shape of user data stored in auth state (from getUser API)
export interface UserData {
  user: User;
  profile: Profile;
}

export interface AuthResponseData {
  token: string;
  user: User;
  profile: Profile;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export type AuthResponse = ApiResponse<AuthResponseData>;

export type GetUserResponse = ApiResponse<UserData>;
