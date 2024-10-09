import { SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { CreateImageDto, CreateMessageDto } from "./dto/create-message.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Message } from "./entities/message.entity";
import { MessageService } from "./message.service";

@WebSocketGateway({ cors: { origin: "*" } })
export class MessageGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    @InjectRepository(Message) private readonly messageRepo: Repository<Message>,
    private readonly messageService: MessageService,
  ) {}

  @SubscribeMessage("joinRoom")
  handleJoinRoom(client: Socket, payload: { chatId: string; userId: string }) {
    const { chatId } = payload;
    client.join(chatId);
  }

  @SubscribeMessage("leaveRoom")
  handleLeaveRoom(client: Socket, payload: { chatId: string }) {
    const { chatId } = payload;
    client.leave(chatId);
  }

  @SubscribeMessage("message")
  async handleMessage(_: Socket, message: CreateMessageDto) {
    const { chat, user } = await this.messageService.areExist(message.userId, message.chatId);

    const newMessage = new Message();
    newMessage.content = message.content;
    newMessage.type = message.type;
    newMessage.user = user;
    newMessage.chat = chat;

    await this.messageRepo.save(newMessage);

    this.server.to(chat.id).emit("reply", newMessage);
  }

  @SubscribeMessage("image")
  async handleImage(_: Socket, message: CreateImageDto) {
    const { chat, user } = await this.messageService.areExist(message.userId, message.chatId);

    const newMessage = new Message();
    newMessage.content = message.images.join(" ");
    newMessage.chat = chat;
    newMessage.user = user;
    newMessage.type = message.type;

    await this.messageRepo.save(newMessage);

    this.server.to(chat.id).emit("reply", newMessage);
  }
}
