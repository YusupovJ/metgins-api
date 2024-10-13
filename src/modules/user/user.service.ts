import { Injectable, NotFoundException } from "@nestjs/common";
import { UpdateUserDto } from "./dto/update-user.dto";
import { Pagination } from "src/helpers/pagination";
import { InjectRepository } from "@nestjs/typeorm";
import { Auth } from "../auth/entities/auth.entity";
import { Like, Not, Repository } from "typeorm";
import { PaginationDto, SearchDto } from "src/helpers/dto";
import { hashSync } from "bcrypt";

@Injectable()
export class UserService {
  constructor(@InjectRepository(Auth) private userRepo: Repository<Auth>) {}

  async findFriend({ search }: SearchDto, userId: number) {
    if (search.length > 2) {
      const users = await this.userRepo.find({
        where: {
          id: Not(userId),
          username: Like(`%${search}%`),
        },
        select: ["avatar", "id", "username", "role"],
      });

      return users;
    }

    return [];
  }

  async findAll({ page, limit }: PaginationDto) {
    const totalItems = await this.userRepo.count();
    const pagination = new Pagination(totalItems, page, limit);

    const users = await this.userRepo.find({
      skip: pagination.offset,
      take: pagination.limit,
      select: ["avatar", "id", "username", "role"],
    });

    return { users, pagination };
  }

  async findOne(id: number) {
    const user = await this.userRepo.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException("Пользователь не найден");
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);

    for (const key in updateUserDto) {
      if (Object.prototype.hasOwnProperty.call(user, key)) {
        if (key === "password") {
          const hashedPassword = hashSync(updateUserDto.password, 3);
          user.password = hashedPassword;

          continue;
        }

        user[key] = updateUserDto[key];
      }
    }

    await this.userRepo.save(user);

    return user;
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.userRepo.delete(id);
  }
}
