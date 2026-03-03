export interface User {
  id: string;
  email: string;
  name: string;
  displayName: string | null;
  avatar: string | null;
  bio: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileData {
  displayName?: string;
  bio?: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: () => void;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}