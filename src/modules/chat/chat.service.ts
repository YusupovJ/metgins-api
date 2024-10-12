import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateChatDto } from "./dto/create-chat.dto";
import { UpdateChatDto } from "./dto/update-chat.dto";
import { Chat } from "./entities/chat.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Pagination } from "src/helpers/pagination";
import { nanoid } from "nanoid";
import { PaginationDto } from "src/helpers/dto";
import { Auth } from "../auth/entities/auth.entity";

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat) private readonly chatRepo: Repository<Chat>,
    @InjectRepository(Auth) private readonly authRepo: Repository<Auth>,
  ) {}

  async create(createChatDto: CreateChatDto, userId: number) {
    const { name, img, type, companionId } = createChatDto;

    const user = await this.authRepo.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException("Пользователь не найден");
    }

    const newChat = new Chat();

    newChat.id = nanoid(16);
    newChat.name = name;
    newChat.img = img;
    newChat.type = type;
    newChat.users = [user];

    if (companionId) {
      const userCompanion = await this.authRepo.findOne({ where: { id: companionId } });

      if (!user) {
        throw new NotFoundException("Собеседник не найден");
      }

      newChat.users.push(userCompanion);
    }

    const savedChat = await this.chatRepo.save(newChat);

    return savedChat;
  }

  async findAll({ limit, page }: PaginationDto, userId: number) {
    const totalItems = await this.chatRepo.count();
    const pagination = new Pagination(totalItems, page, limit);
    let chats = await this.chatRepo
      .createQueryBuilder("chat")
      .leftJoinAndSelect("chat.users", "users")
      .leftJoinAndSelect(
        "chat.messages",
        "message",
        "message.id = (SELECT m.id FROM message m WHERE m.chatId = chat.id ORDER BY m.created_at DESC LIMIT 1)",
      )
      .leftJoinAndSelect("message.user", "user")
      .innerJoin("chat.users", "userFilter")
      .where("userFilter.id = :userId", { userId })
      .skip(pagination.offset)
      .take(pagination.limit)
      .getMany();

    chats = chats.map((chat) => {
      if (chat.type === "personal") {
        const userCompanion = chat.users.find((user) => user.id !== userId);
        return { ...chat, name: userCompanion.username, img: userCompanion.avatar };
      }

      return chat;
    });

    return { chats, pagination };
  }

  async findOne(id: string, userId?: number) {
    const chat = await this.chatRepo.findOne({
      relations: ["users"],
      where: { id },
    });

    if (chat.type === "personal") {
      const userCompanion = chat.users.find((user) => user.id !== userId);
      chat.name = userCompanion.username;
    }

    if (!chat) {
      throw new NotFoundException("Чат не найден");
    }

    return chat;
  }

  async update(id: string, updateChatDto: UpdateChatDto) {
    const chat = await this.findOne(id);

    for (const key in updateChatDto) {
      if (Object.prototype.hasOwnProperty.call(chat, key)) {
        chat[key] = updateChatDto[key];
      }
    }

    const updatedChat = await this.chatRepo.save(chat);

    return updatedChat;
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.chatRepo.delete(id);
  }
}
