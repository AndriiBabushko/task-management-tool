import { AxiosResponse } from 'axios';
import { axiosInstance } from '../utils/axios';
import { CategoriesResponse } from '../models/response/CategoriesResponse';

export default class CategoryService {
  static async fetchCategories(): Promise<AxiosResponse<CategoriesResponse>> {
    return axiosInstance.get<CategoriesResponse>('/categories/');
  }
}
