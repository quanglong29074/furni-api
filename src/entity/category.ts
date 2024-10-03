import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('category')
export class Category {
  @PrimaryGeneratedColumn()
  id!: number; // Có thể không được khởi tạo ngay lập tức

  @Column({ type: 'varchar', length: 150 })
  category_name!: string; // Chắc chắn sẽ được khởi tạo, dùng dấu '!' để tránh lỗi

  @Column({ type: 'longtext' }) // Thay đổi kiểu dữ liệu từ varchar sang longtext
  image!: string; // Chắc chắn sẽ được khởi tạo, dùng dấu '!' để tránh lỗi

  @Column({ type: 'varchar', length: 255, nullable: true })
  slug!: string; // Có thể nullable
}
