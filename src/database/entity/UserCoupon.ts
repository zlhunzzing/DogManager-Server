import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn
} from "typeorm";

import { COUPON_STATE } from "../../common/enum";

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
    default: COUPON_STATE.ENABLE,
    type: "enum",
    enum: COUPON_STATE
  })
  couponState: COUPON_STATE;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
