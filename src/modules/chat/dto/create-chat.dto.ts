import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString, MinLength } from "class-validator";

export class CreateChatDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  @MinLength(2)
  name: string;

  @IsString()
  @ApiProperty()
  img: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  type: string;

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional()
  companionId: number;
}
