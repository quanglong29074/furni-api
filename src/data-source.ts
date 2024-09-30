// data-source.ts
import { DataSource } from 'typeorm';
import { Category } from './entity/category';
import { Brand } from './entity/brand';
import { Material } from './entity/material';
import { Size } from './entity/size';
import { Product } from './entity/product';
import { User } from './entity/user';
import { Role } from './entity/role';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '', // Thay đổi nếu cần
  database: 'furni_shop', // Tên cơ sở dữ liệu của bạn
  entities: [Category, User,Role, Brand, Material, Size, Product], // Bao gồm tất cả các entity
});
