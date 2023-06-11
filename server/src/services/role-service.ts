import { ClientSession, startSession } from 'mongoose';

import { mongooseModel as RoleModel } from '../models/role-model.js';
import { mongooseModel as UserModel } from '../models/user-model.js';
import HttpError from '../exceptions/http-error.js';
import RoleDto from '../DTO/role-dto.js';
import { IRole } from '../ts/interfaces/IRole.js';

class RoleService {
  async getRoles() {
    let roles;

    try {
      roles = await RoleModel.find();
    } catch (e) {
      throw new HttpError('Something went wrong while fetching roles data from DB.', 500);
    }

    return {
      roles: roles.map((r) => new RoleDto(r)),
      success: true,
    };
  }

  async getRoleByID(roleID: string) {
    let role;

    try {
      role = await RoleModel.findById(roleID);
    } catch (e) {
      throw new HttpError('Something went wrong while searching for some role by role ID.', 500);
    }

    if (!role) {
      throw new HttpError("Couldn't find a role for the provided role ID!", 404);
    }

    const roleDTO: RoleDto = new RoleDto(role);
    return { role: roleDTO, success: true };
  }

  async createRole({ name, description }: IRole) {
    let createdRole;

    try {
      createdRole = await RoleModel.create({
        name,
        description,
      });
    } catch (e) {
      throw new HttpError('Creating role failed!', 500);
    }

    const roleDTO: RoleDto = new RoleDto(createdRole);

    return {
      role: roleDTO,
      success: true,
    };
  }

  async updateRole(roleID: string, { name, description }: IRole) {
    let updatedRole;

    try {
      updatedRole = await RoleModel.findById(roleID);
    } catch (e) {
      throw new HttpError('Something went wrong while searching for some role by role ID.', 500);
    }

    if (!updatedRole) {
      throw new HttpError("Couldn't find a role for the provided role ID!", 404);
    }

    if (name) updatedRole.name = name;
    if (description) updatedRole.description = description;

    try {
      await updatedRole.save();
    } catch (e) {
      throw new HttpError('Something went wrong while updating role.', 500);
    }

    const roleDTO: RoleDto = new RoleDto(updatedRole);

    return {
      role: roleDTO,
      success: true,
    };
  }

  async deleteRole(roleID: string) {
    let deletedRole, users;

    try {
      users = await UserModel.find().populate('roles');
      deletedRole = await RoleModel.findById(roleID);
    } catch (e) {
      throw new HttpError('Something went wrong while searching for some data in DB.', 500);
    }

    if (!deletedRole) {
      throw new HttpError("Couldn't find a role for the provided role ID!", 404);
    }

    try {
      const session: ClientSession = await startSession();
      session.startTransaction();

      for (const user of users) {
        await UserModel.updateOne({ _id: user._id }, { $pull: { roles: deletedRole._id } }, { session });
      }

      await deletedRole.deleteOne({ session });
      await session.commitTransaction();
    } catch (e) {
      throw new HttpError('Something went wrong while deleting role.', 500);
    }

    return {
      success: true,
    };
  }

  async createUserRole() {
    let userRole;

    try {
      userRole = await RoleModel.findOne({ name: 'user' });
    } catch (e) {
      throw new HttpError('Something went wrong while searching for user role. Please try again later.', 500);
    }

    if (!userRole) {
      try {
        userRole = await RoleModel.create({
          name: 'user',
          description: 'Just a user with default access. Nothing special',
        });

        console.log(userRole);
      } catch (e) {
        throw new HttpError('Something went wrong while creating the non-existing user role.', 500);
      }
    }

    return userRole;
  }

  async createAdminRole() {
    let adminRole;

    try {
      adminRole = await RoleModel.findOne({ name: 'admin' });
    } catch (e) {
      throw new HttpError('Something went wrong while searching for admin role. Please try again later.', 500);
    }

    if (!adminRole) {
      try {
        adminRole = await RoleModel.create({
          name: 'admin',
          description: 'Boss of the gym!',
        });
      } catch (e) {
        throw new HttpError('Something went wrong while creating the non-existing admin role.', 500);
      }
    }

    return adminRole;
  }

  async createOwnerRole() {
    let ownerRole;

    try {
      ownerRole = await RoleModel.findOne({ name: 'owner' });
    } catch (e) {
      throw new HttpError('Something went wrong while searching for owner role. Please try again later.', 500);
    }

    if (!ownerRole) {
      try {
        ownerRole = await RoleModel.create({
          name: 'owner',
          description: 'Group owner.',
        });
      } catch (e) {
        throw new HttpError('Something went wrong while creating the non-existing owner role.', 500);
      }
    }

    return ownerRole;
  }

  async createRolesIfNotExist() {
    try {
      await this.createAdminRole();
      await this.createUserRole();
      await this.createOwnerRole();
    } catch (e) {
      throw e;
    }
  }
}

export default new RoleService();
