import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  AfterLoad
} from "typeorm";
import crypto from "crypto";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  mobile: string;

  @Column()
  address: string;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;

  // @BeforeInsert()
  // hashing() {
  //   console.log("BeforeInsert 실행");
  //   console.log("여기 들어왔다다다다!!!!!!!!!!!");
  //   // const shasum = crypto.createHmac("sha512", "thisismysecretkey");
  //   // shasum.update(this.password);
  //   // this.password = shasum.digest("hex");

  //   const cipher = crypto.createCipher("aes192", "thisismysecretkey");
  //   cipher.update(this.password, "utf8", "base64");
  //   this.password = cipher.final("base64");
  // }

  // @AfterLoad()
  // async updateCounters() {
  //   if (this.password) {
  //     // var shasum = crypto.createHmac('sha512', 'thisismysecretkey');
  //     // shasum.update(data.where.password);
  //     // data.where.password = shasum.digest('hex');
  //     console.log("AfterLoad 실행");
  //     // const decipher = crypto.createDecipher("aes192", "thisismysecretkey");
  //     // decipher.update(this.password, "base64", "utf8");
  //     // this.password = decipher.final("utf8");
  //   }
  // }
}
