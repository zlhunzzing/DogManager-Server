import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

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
}
