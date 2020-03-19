import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

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
}
