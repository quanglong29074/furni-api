import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('material')
export class Material {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 150 })
  material_name!: string;
}
