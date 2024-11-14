import { DataSource } from 'typeorm';
import { Category } from './entity/category'; 
import { Brand } from './entity/brand';
import { Material } from './entity/material';
import { Size } from './entity/size';
import { Product } from './entity/product'; 
import { User } from './entity/user';
import { Role } from './entity/role';
import { Cart } from './entity/cart';
import { Order } from './entity/order';
import { OrderProduct } from './entity/order_product';
import { Favorite } from './entity/favorite';
import { Review } from './entity/review';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'root', 
  database: 'furni_shop', 
  entities: [User, Role, Brand, Material, Size, Category, Product, Cart, Order, OrderProduct,Favorite,Review], 
});
