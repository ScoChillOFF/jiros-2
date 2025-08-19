export interface User {
  id: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  projects: string[];
  createdAt: number;
  updatedAt: number;
}
