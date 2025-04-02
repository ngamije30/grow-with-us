export interface UserType {
  id: string;
  email: string;
  name: string;
  profileImage?: string;
}

export interface AuthRequest extends Request {
  user?: {
    userId: string;
  };
}