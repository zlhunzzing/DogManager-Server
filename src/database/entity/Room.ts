import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn
} from "typeorm";

@Entity()
export class Room {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column({
    default: true
  })
  adminCheck: boolean;

  @CreateDateColumn()
  createdAt: string;
}
