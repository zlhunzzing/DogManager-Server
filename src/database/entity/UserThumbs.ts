import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class UserThumbs {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  commentId: number;
}
