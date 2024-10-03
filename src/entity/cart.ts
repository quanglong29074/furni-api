import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user';
import { Product } from './product';

@Entity('cart')
export class Cart {
  @PrimaryGeneratedColumn()
  id!: number;  // Khóa chính, tự động tăng

  @ManyToOne(() => User)  // Liên kết với bảng `user`
  @JoinColumn({ name: 'user_id' })
  user!: User;  // `user_id` tham chiếu tới bảng `user`

  @ManyToOne(() => Product)  // Liên kết với bảng `product`
  @JoinColumn({ name: 'product_id' })
  product!: Product;  // `product_id` tham chiếu tới bảng `product`

  @Column({ type: 'int' })
  qty!: number;  // Số lượng sản phẩm trong giỏ hàng

  @Column({ type: 'double' })
  total!: number;  // Tổng giá trị cho sản phẩm trong giỏ hàng
}
