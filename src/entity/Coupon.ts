import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn
} from "typeorm";

@Entity()
export class Coupon {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  couponName: string;

  @Column()
  couponCode: string;

  @Column()
  description: string;

  @Column()
  period: number;

  @Column()
  discount: string;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;

  @Column({
    type: "boolean",
    default: false
  })
  isDeleted: boolean;
}
