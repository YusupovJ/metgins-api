import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class CreateAuthDto {
  @ApiProperty()
  @IsString()
  username: string;

  @ApiProperty()
  @IsString()
  password: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  token: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  avatar: string;
}
