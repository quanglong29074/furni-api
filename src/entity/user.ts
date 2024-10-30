import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;  // Sử dụng ! để bỏ qua cảnh báo về trình khởi tạo

  @Column({ type: 'varchar', length: 50 })
  user_name!: string;

  @Column({ type: 'varchar', length: 50 })
  full_name!: string;

  @Column({ type: 'varchar', length: 150 })
  email!: string;

  @Column({ type: 'longtext', nullable: true })
  thumbnail!: string;  // Có thể dùng dấu ? cho các trường tùy chọn

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone_number!: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  address!: string;

  @Column({ type: 'varchar', length: 255 })
  password!: string;

  @Column({ type: 'tinyint', width: 4, default: 1 })
  is_active!: number;
}
