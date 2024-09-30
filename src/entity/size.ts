import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('size')
export class Size {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 150 })
  size_name!: string;
}
