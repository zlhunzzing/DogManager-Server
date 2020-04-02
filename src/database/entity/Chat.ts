import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn
} from "typeorm";

@Entity()
export class Chat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @Column()
  roomId: number;

  @Column()
  writer: string;

  @CreateDateColumn()
  createdAt: Date;
}
