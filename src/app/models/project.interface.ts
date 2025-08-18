export interface Project {
  id: string;
  name: string;
  description: string | null;
  ownerId: string; 
  memberIds: string[];
  createdAt: number;
  updatedAt: number;
}
