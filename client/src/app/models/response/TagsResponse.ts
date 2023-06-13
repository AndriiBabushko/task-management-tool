import { ITag } from '../interfaces/ITag';

export interface TagsResponse {
  success: boolean;
  message: string;
  tags: ITag[];
}
