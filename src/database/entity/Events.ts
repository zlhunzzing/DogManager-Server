import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn
} from "typeorm";

@Entity()
export class Events {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  eventTitle: string;

  @Column()
  startDate: string;

  @Column({
    nullable: true
  })
  endDate: string;

  @Column()
  detailPageUrl: string;

  @Column()
  buttonImage: string;

  @Column()
  bannerImage: string;

  @Column()
  pageImage: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // type boolean으로 바꾸는거 논의해보기
  @Column({
    type: "boolean",
    default: false
  })
  isDeleted: boolean;

  @Column()
  couponCode: string;
}
