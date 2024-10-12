import { Controller, Get, Query, Req, UseGuards } from "@nestjs/common";
import { GetMessagesDto } from "src/helpers/dto";
import { MessageService } from "./message.service";
import { ApiResponse } from "src/helpers/apiResponse";
import { AuthGuard } from "src/helpers/guards";
import { IRequest } from "src/helpers/types";
import { ApiTags } from "@nestjs/swagger";

@Controller("message")
@ApiTags("message")
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get()
  @UseGuards(AuthGuard)
  async findAll(@Query() query: GetMessagesDto, @Req() req: IRequest) {
    const { messages } = await this.messageService.findAll(query, req.userId);
    return new ApiResponse(messages, 200);
  }
}
