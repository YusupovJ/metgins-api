import { RoleEnum } from "src/helpers/enums";
import { RootEntity } from "src/helpers/root.entity";
import { Chat } from "src/modules/chat/entities/chat.entity";
import { Column, Entity, ManyToMany } from "typeorm";

@Entity()
export class Auth extends RootEntity {
  @Column("varchar")
  username: string;

  @Column("varchar")
  password: string;

  @Column("varchar", { nullable: true })
  token: string;

  @Column("enum", { enum: RoleEnum, default: RoleEnum.user })
  role: string;

  @Column("varchar", { nullable: true })
  avatar?: string;

  @ManyToMany(() => Chat, (chat) => chat.users, { onDelete: "CASCADE" })
  chats: Chat[];
}
