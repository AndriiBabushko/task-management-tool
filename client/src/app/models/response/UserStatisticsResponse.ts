export interface UserStatisticsResponse {
  success: boolean;
  message: string;
  usersWithoutTasks: { total: number }[];
  notActivatedUsers: { total: number }[];
  usersByRoles: { _id: string; name: string; count: number }[];
}
