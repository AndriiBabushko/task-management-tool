import { ICategory } from '../interfaces/ICategory';

export interface CategoriesResponse {
  success: boolean;
  message: string;
  categories: ICategory[];
}
