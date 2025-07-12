import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;
  
  @Column()
  email!: string;

  @Column()
  password!: string;

  @Column({ nullable: true })
  birthDate?: string;

  @Column({ nullable: true })
  picture?: string;
}
