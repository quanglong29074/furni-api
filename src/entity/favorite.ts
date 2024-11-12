import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Product } from './product';
import { User } from './user';

@Entity('favorite')
export class Favorite {
    @PrimaryColumn()
    product_id!: number;

    @PrimaryColumn()
    user_id!: number;

    @ManyToOne(() => Product, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'product_id' })
    product!: Product;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user!: User;
}
