import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('brand')
export class Brand {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 150 })
  brand_name!: string;
}
