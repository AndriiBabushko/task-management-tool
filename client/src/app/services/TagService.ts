import { AxiosResponse } from 'axios';
import { axiosInstance } from '../utils/axios';
import { TagsResponse } from '../models/response/TagsResponse';

export default class TagService {
  static async fetchTags(): Promise<AxiosResponse<TagsResponse>> {
    return axiosInstance.get<TagsResponse>('/tags/');
  }
}
