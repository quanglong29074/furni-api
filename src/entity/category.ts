import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Product } from './product';

@Entity('category')
export class Category {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'varchar', length: 150 })
    category_name!: string;

    @Column({ type: 'longtext' })
    image!: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    slug!: string;

}
