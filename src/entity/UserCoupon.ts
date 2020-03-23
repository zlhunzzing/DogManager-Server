import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn
} from "typeorm";

// enum couponState {
//   enable,
//   disable,
//   canceled
// }

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

  @Column()
  isDeleted: number;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;
}
