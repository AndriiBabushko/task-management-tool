import { PipelineStage } from 'mongoose';
export const isCompletedCountPipeline: PipelineStage[] = [
  {
    $match: {
      isCompleted: true,
    },
  },
  {
    $group: {
      _id: null,
      count: { $sum: 1 },
    },
  },
];

export const userWithMaxTasksCreatedPipeline: PipelineStage[] = [
  {
    $group: {
      _id: '$creator',
      count: { $sum: 1 },
    },
  },
  {
    $sort: {
      count: -1,
    },
  },
  {
    $limit: 1,
  },
  {
    $lookup: {
      from: 'users',
      localField: '_id',
      foreignField: '_id',
      as: 'user',
    },
  },
  {
    $unwind: '$user',
  },
  {
    $lookup: {
      from: 'tasks',
      localField: '_id',
      foreignField: 'creator',
      as: 'tasks',
    },
  },
  {
    $project: {
      user: 1,
      taskCount: '$count',
      tasks: 1,
    },
  },
];

export const theOldestTaskPipeline: PipelineStage[] = [
  {
    $sort: {
      creationDate: 1,
    },
  },
  {
    $limit: 1,
  },
];
