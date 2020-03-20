import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn
} from "typeorm";

@Entity()
export class UserCoupon {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  couponId: string;

  @Column()
  userId: string;

  @Column()
  expiredAt: string;

  @Column({
    type: "boolean",
    default: false
  })
  isDeleted: boolean;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;
}
