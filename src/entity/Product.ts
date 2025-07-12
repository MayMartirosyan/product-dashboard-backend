import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './User';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column('float')
  price!: number;

  @Column('float', { nullable: true })
  discountedPrice?: number;

  @Column({ nullable: true })
  picture?: string;

  @Column({ nullable: true })
  description?: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user!: User;
}