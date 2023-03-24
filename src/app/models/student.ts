import { IGrade } from './grade';

export interface IStudent {
  birthDate?: string;
  id?: number;
  fullname?: string;
  graduationScore?: number;
  phone?: string;
  satScore?: number;
  createdAt?: string;
  profilePicture?: string;
  studentGrades?: IGrade[],
  checked?: boolean;
  email?: string;
}
