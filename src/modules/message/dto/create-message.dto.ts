import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { MessageTypeEnum } from "src/helpers/enums";

class RootDto {
  @IsString()
  chatId: string;

  @IsNumber()
  userId: number;

  @IsEnum(MessageTypeEnum)
  @IsOptional()
  type: MessageTypeEnum;
}

export class CreateMessageDto extends RootDto {
  @IsString()
  content: string;
}

export class CreateImageDto extends RootDto {
  @IsString()
  images: string[];
}
