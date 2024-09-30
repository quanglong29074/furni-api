import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn()
  id!: number; // Khóa chính, tự động tăng

  @Column({ type: 'varchar', length: 50 })
  user_name!: string; // Tên người dùng

  @Column({ type: 'varchar', length: 50 })
  role!: string; // Vai trò
}
