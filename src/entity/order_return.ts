import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    OneToMany,
  } from 'typeorm';
  import { User } from './user';
  import { Order } from './order';
  import { Product } from './product';
  import { ReturnImage } from './return_images';
  
  @Entity('order_return')
  export class OrderReturn {
    @PrimaryGeneratedColumn()
    id!: number;
  
    @ManyToOne(() => Order, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'order_id' })
    order!: Order;
  
    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user!: User;
  
    @ManyToOne(() => Product, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'product_id' })
    product!: Product;
  
    @CreateDateColumn({ type: 'datetime', precision: 6 })
    return_date!: Date;
  
    @Column({ type: 'varchar', length: 255, nullable: true })
    status?: string;
  
    @Column({ type: 'varchar', length: 255, nullable: true })
    reason?: string;
  
    @Column({ type: 'decimal', precision: 18, scale: 2, nullable: true })
    return_amount?: number;
  
    @Column({ type: 'varchar', length: 255, nullable: true })
    description?: string;
  
    @Column({ type: 'int', nullable: false })
    qty!: number;
  }
  