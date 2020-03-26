import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn
} from "typeorm";

enum couponState {
  enable,
  disable,
  canceled
}

@Entity()
export class UserCoupon {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  couponId: number;

  @Column()
  userId: number;

  @Column()
  expiredAt: string;

  @Column({
    default: couponState.enable
  })
  isDeleted: number;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;
}
