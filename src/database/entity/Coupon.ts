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
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({
    type: "boolean",
    default: false
  })
  isDeleted: boolean;
}
