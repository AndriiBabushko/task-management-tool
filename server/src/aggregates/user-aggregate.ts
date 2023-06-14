import { PipelineStage } from 'mongoose';

export const notActivatedUsersPipeline: PipelineStage[] = [
  {
    $match: {
      isActivated: false,
    },
  },
  {
    $count: 'total',
  },
];

export const usersWithoutTasksPipeline: PipelineStage[] = [
  {
    $lookup: {
      from: 'tasks',
      localField: 'tasks',
      foreignField: '_id',
      as: 'tasks',
    },
  },
  {
    $match: {
      tasks: { $size: 0 },
      isActivated: true,
    },
  },
  {
    $count: 'total',
  },
];

export const usersByRolesPipeline: PipelineStage[] = [
  {
    $unwind: '$roles',
  },
  {
    $group: {
      _id: '$roles',
      count: { $sum: 1 },
    },
  },
];
