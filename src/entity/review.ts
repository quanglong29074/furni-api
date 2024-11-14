import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Product } from './product';  // Import Product model
import { User } from './user';  // Import User model (assuming you have a User model)

@Entity('review')
export class Review {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product!: Product;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({ type: 'text', nullable: true })
  comment!: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  status!: string; // Could be 'approved', 'pending', etc.

  @Column({ type: 'datetime', nullable: true })
  review_date!: Date;

  @Column({ type: 'int', nullable: true })
  rating_value!: number;  // Rating value, assume integer like 1-5
}
