import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany,JoinColumn } from 'typeorm';
import { User } from './user';
import { OrderProduct } from './order_product';


@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: "user_id" })
  user!: User;

  @Column({ type: 'datetime' })
  order_date!: Date;

  @Column({ type: 'decimal', precision: 18, scale: 2 })
  total_amount!: number;

  @Column({ type: 'varchar', length: 255 })
  status!: string;

  @Column({ type: 'varchar', length: 255 })
  is_paid!: string;

  @Column({ type: 'varchar', length: 255 })
  province!: string;

  @Column({ type: 'varchar', length: 255 })
  district!: string;

  @Column({ type: 'varchar', length: 255 })
  ward!: string;

  @Column({ type: 'varchar', length: 255 })
  address_detail!: string;

  @Column({ type: 'varchar', length: 255 })
  full_name!: string;

  @Column({ type: 'varchar', length: 255 })
  email!: string;

  @Column({ type: 'varchar', length: 20 })
  telephone!: string;

  @Column({ type: 'varchar', length: 255 })
  payment_method!: string;

  @Column({ type: 'varchar', length: 255 })
  shipping_method!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  note!: string;

  @Column({ type: 'datetime', nullable: true })
  schedule!: Date;

  @Column({ type: 'varchar', length: 50, nullable: true })
  cancel_reason!: string | null;

  @Column({ type: 'varchar', length: 255 })
  order_code!: string;

  @Column({ type: 'varchar', length: 255 })
  secure_token!: string;

 
}
