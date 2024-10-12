import { Controller, Get, Body, Patch, Param, Delete, Query, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { UpdateUserDto } from "./dto/update-user.dto";
import { ApiTags } from "@nestjs/swagger";
import { PaginationDto } from "src/helpers/dto";
import { ApiResponse } from "src/helpers/apiResponse";
import { AuthGuard, RoleGuard } from "src/helpers/guards";

@Controller("user")
@ApiTags("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(RoleGuard)
  async findAll(@Query() query: PaginationDto) {
    const { pagination, users } = await this.userService.findAll(query);

    return new ApiResponse(users, 200, pagination);
  }

  @Get(":id")
  @UseGuards(RoleGuard)
  async findOne(@Param("id") id: string) {
    const user = await this.userService.findOne(+id);
    return new ApiResponse(user);
  }

  @Patch(":id")
  @UseGuards(AuthGuard)
  async update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    const user = await this.userService.update(+id, updateUserDto);
    return new ApiResponse(user, 201);
  }

  @Delete(":id")
  @UseGuards(RoleGuard)
  async remove(@Param("id") id: string) {
    await this.userService.remove(+id);
    return new ApiResponse("Пользователь удален");
  }
}
