import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';
  import { OrderReturn } from './order_return';
  
  @Entity('return_images')
  export class ReturnImage {
    @PrimaryGeneratedColumn()
    id!: number;
  
    @ManyToOne(() => OrderReturn, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'order_return_id' })
    orderReturn!: OrderReturn;
  
    @Column({ type: 'longtext', nullable: false })
    image_path!: string;
  }
  