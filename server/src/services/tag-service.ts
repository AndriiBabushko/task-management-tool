import { ClientSession, startSession } from 'mongoose';

import { mongooseModel as TagModel } from '../models/tag-model.js';
import { mongooseModel as TaskModel } from '../models/task-model.js';
import HttpError from '../exceptions/http-error.js';
import TagDto from '../DTO/tag-dto.js';
import { ITag } from '../ts/interfaces/ITag.js';

class TagService {
  async getTags() {
    let tags;

    try {
      tags = await TagModel.find();
    } catch (e) {
      throw new HttpError('Something went wrong while fetching tags data from DB.', 500);
    }

    return {
      tags: tags.map((t) => new TagDto(t)),
      success: true,
    };
  }

  async getTagByID(tagID: string) {
    let tag;

    try {
      tag = await TagModel.findById(tagID);
    } catch (e) {
      throw new HttpError('Something went wrong while searching for some tag by tag ID.', 500);
    }

    if (!tag) {
      throw new HttpError("Couldn't find a tag for the provided tag ID!", 404);
    }

    const tagDTO: TagDto = new TagDto(tag);

    return { tag: tagDTO, success: true };
  }

  async createTag({ name, description }: ITag) {
    let createdTag;

    try {
      createdTag = await TagModel.create({
        name,
        description,
      });
    } catch (e) {
      throw new HttpError('Creating tag failed!', 500);
    }

    const tagDTO: TagDto = new TagDto(createdTag);

    return {
      tag: tagDTO,
      success: true,
    };
  }

  async updateTag(tagID: string, { name, description }: ITag) {
    let updatedTag;

    try {
      updatedTag = await TagModel.findById(tagID);
    } catch (e) {
      throw new HttpError('Something went wrong while searching for some tag by tag ID.', 500);
    }

    if (!updatedTag) {
      throw new HttpError("Couldn't find a tag for the provided tag ID!", 404);
    }

    if (name) updatedTag.name = name;
    if (description) updatedTag.description = description;

    try {
      await updatedTag.save();
    } catch (e) {
      throw new HttpError('Something went wrong while updating tag.', 500);
    }

    const tagDTO: TagDto = new TagDto(updatedTag);

    return {
      tag: tagDTO,
      success: true,
    };
  }

  async deleteTag(tagID: string) {
    let deletedTag, tasks;

    try {
      tasks = await TaskModel.find().populate('tags');
      deletedTag = await TagModel.findById(tagID);
    } catch (e) {
      throw new HttpError('Something went wrong while searching for some data in DB.', 500);
    }

    if (!deletedTag) {
      throw new HttpError("Couldn't find a tag for the provided tag ID!", 404);
    }

    try {
      const session: ClientSession = await startSession();
      session.startTransaction();

      for (const task of tasks) {
        await TaskModel.updateOne({ _id: task._id }, { $pull: { tags: deletedTag._id } }, { session });
      }

      await deletedTag.deleteOne({ session });
      await session.commitTransaction();
    } catch (e) {
      throw new HttpError('Something went wrong while deleting tag.', 500);
    }

    return {
      success: true,
    };
  }
}

export default new TagService();
