import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from './user'; // Import User model
import { Order } from './order'; // Import Order model

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn()
  id!: number; 

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User; 

  @ManyToOne(() => Order, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order?: Order; 

  @Column({ type: 'varchar', length: 255, nullable: false }) 
  title!: string;

  @Column({ type: 'text', nullable: false })
  message!: string; 

  @CreateDateColumn({ type: 'datetime', precision: 6 })
  created_at!: Date; 
}
