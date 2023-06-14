import { ClientSession, startSession, Types } from 'mongoose';

import { mongooseModel as GroupModel } from '../models/group-model.js';
import { mongooseModel as UserModel } from '../models/user-model.js';
import HttpError from '../exceptions/http-error.js';
import GroupDto from '../DTO/group-dto.js';
import { IGroup } from '../ts/interfaces/IGroup.js';

class GroupService {
  async getGroups() {
    let groups;

    try {
      groups = await GroupModel.find();
    } catch (e) {
      throw new HttpError('Something went wrong while fetching groups data from DB.', 500);
    }

    return {
      groups: groups.map((g) => new GroupDto(g)),
      success: true,
    };
  }

  async getGroupByID(groupID: string) {
    let group;

    try {
      group = await GroupModel.findById(groupID);
    } catch (e) {
      throw new HttpError('Something went wrong while searching for some group by group ID.', 500);
    }

    if (!group) {
      throw new HttpError("Couldn't find a group for the provided group ID!", 404);
    }

    const groupDTO: GroupDto = new GroupDto(group);

    return { group: groupDTO, success: true };
  }

  private async checkGroupData({ users }, creatorID: string | null = null) {
    let identifiedUsers, identifiedCreator;

    if (creatorID != null) {
      try {
        identifiedCreator = await UserModel.findById(creatorID);
      } catch (e) {
        throw new HttpError("Couldn't find group creator for provided id!", 500);
      }

      if (!identifiedCreator) throw new HttpError("Couldn't find group creator for provided id.", 404);
    }

    if (users) {
      try {
        identifiedUsers = await Promise.all(
          users.map(async (u) => {
            let identifiedUser;

            try {
              identifiedUser = await UserModel.findById(u);
            } catch (e) {
              throw new HttpError("Couldn't find group for provided id!", 500);
            }

            if (!identifiedUser) throw new HttpError("Couldn't find group for provided id.", 404);
          }),
        );
      } catch (e) {
        throw new HttpError(e.message, e.status);
      }
    }

    return {
      identifiedUsers,
    };
  }

  async createGroup(creatorID: Types.ObjectId, { name, description, image, users, access }: IGroup) {
    let groupCheck, createdGroup;

    try {
      groupCheck = await this.checkGroupData({ users }, creatorID.toString());
    } catch (e) {
      throw new HttpError(e.message, e.status);
    }

    if (!(groupCheck instanceof HttpError)) {
      if (users) users.push(creatorID);
      else users = [creatorID];

      try {
        createdGroup = await GroupModel.create({
          name,
          description,
          image,
          users,
          creator: creatorID,
          access,
        });
      } catch (e) {
        throw new HttpError('Creating group failed!', 500);
      }

      const groupDTO: GroupDto = new GroupDto(createdGroup);

      return {
        group: groupDTO,
        success: true,
      };
    }

    throw new HttpError(groupCheck.message, groupCheck.status);
  }

  async updateGroup(groupID: string, userID: Types.ObjectId, { name, description, image, users, access }: IGroup) {
    let groupCheck;

    try {
      groupCheck = await this.checkGroupData({ users });
    } catch (e) {
      throw new HttpError(e.message, e.status);
    }

    if (!(groupCheck instanceof HttpError)) {
      let updatedGroup;

      try {
        updatedGroup = await GroupModel.findById(groupID).populate('creator').populate('users');
      } catch (e) {
        throw new HttpError('Something went wrong while searching for some group by group ID.', 500);
      }

      if (!updatedGroup) {
        throw new HttpError("Couldn't find a group for the provided group ID!", 404);
      }

      if (updatedGroup.creator != userID) {
        throw new HttpError("No access to change task. Different user and creator id's.", 404);
      }

      if (name) updatedGroup.name = name;
      if (description) updatedGroup.description = description;
      if (image) updatedGroup.image = image;
      if (users) updatedGroup.users = users;
      if (access) updatedGroup.access = access;

      try {
        await updatedGroup.save();
      } catch (e) {
        throw new HttpError('Something went wrong while updating group.', 500);
      }

      const groupDTO: GroupDto = new GroupDto(updatedGroup);

      return {
        group: groupDTO,
        success: true,
      };
    }

    throw new HttpError(groupCheck.message, groupCheck.status);
  }

  async deleteGroup(groupID: string, userID: Types.ObjectId) {
    let deletedGroup;

    try {
      deletedGroup = await GroupModel.findById(groupID).populate('users');
    } catch (e) {
      throw new HttpError('Something went wrong while searching for some group by group ID.', 500);
    }

    if (!deletedGroup) {
      throw new HttpError("Couldn't find a group for the provided group ID!", 404);
    }

    if (deletedGroup.creator._id != userID) {
      throw new HttpError("No access to delete group. Different user and creator id's.", 404);
    }

    try {
      const session: ClientSession = await startSession();
      session.startTransaction();

      for (const user of deletedGroup.users) {
        await UserModel.updateOne({ _id: user._id }, { $pull: { groups: deletedGroup._id } }, { session });
      }

      await deletedGroup.deleteOne({ session });
      await session.commitTransaction();
    } catch (e) {
      throw new HttpError('Something went wrong while deleting task.', 500);
    }

    return {
      success: true,
    };
  }
}

export default new GroupService();
