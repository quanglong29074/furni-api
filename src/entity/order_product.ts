import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Order } from './order';
import { Product } from './product';

@Entity('order_product')
export class OrderProduct {
  @PrimaryColumn({ name: 'order_id', type: 'int' })  
  orderId!: number;

  @PrimaryColumn({ name: 'product_id', type: 'int' })  
  productId!: number;

  @ManyToOne(() => Order, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })  // Khớp với tên cột trong cơ sở dữ liệu
  order!: Order;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })  // Khớp với tên cột trong cơ sở dữ liệu
  product!: Product;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price!: number;

  @Column({ type: 'int' })
  qty!: number;

  @Column({ type: 'int' })
  status!: number;
}