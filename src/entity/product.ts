import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn,OneToMany } from 'typeorm';
import { Category } from './category';
import { Brand } from './brand';
import { Material } from './material';
import { Size } from './size';
import { OrderProduct } from './order_product';
@Entity('product')
export class Product {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 150 })
  product_name!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  slug!: string;

  @Column({ type: 'decimal', precision: 14, scale: 2, nullable: true })
  price!: number;

  @Column({ type: 'longtext', nullable: true })
  thumbnail!: string;

  @Column({ type: 'int', nullable: true })
  qty!: number;

  @Column({ type: 'text', nullable: true })
  description!: string;
  
  @ManyToOne(() => Category)
  @JoinColumn({ name: 'category_id' })
  category!: Category;

  @ManyToOne(() => Brand)
  @JoinColumn({ name: 'brand_id' })
  brand!: Brand;  // Sử dụng dấu ? để cho phép undefined

  @ManyToOne(() => Material)
  @JoinColumn({ name: 'material_id' })
  material!: Material;  // Sử dụng dấu ? để cho phép undefined

  @ManyToOne(() => Size)
  @JoinColumn({ name: 'size_id' })
  size!: Size;  // Sử dụng dấu ? để cho phép undefined

  @Column({ type: 'varchar', length: 50, nullable: true })
  color!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  weight!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  height!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  length!: number; 
}
