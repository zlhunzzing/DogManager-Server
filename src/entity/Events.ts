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
  event_title: string;

  @Column()
  start_date: string;

  @Column()
  end_date: string;

  @Column({
    nullable: true
  })
  detail_page_url: string;

  @Column({
    nullable: true
  })
  button_url: string;

  @Column()
  button_image: string;

  @Column()
  banner_image: string;

  @Column()
  page_image: string;

  @CreateDateColumn()
  created_at: string;

  @UpdateDateColumn()
  updated_at: string;

  // type boolean으로 바꾸는거 논의해보기
  @Column({
    type: "boolean",
    default: false
  })
  is_deleted: boolean;
}
