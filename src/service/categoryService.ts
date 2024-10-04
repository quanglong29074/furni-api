import { Category } from "../entity/category";
import { AppDataSource } from '../data-source';

export const getAllCategory = async () => {
    const getAllCategory = await AppDataSource.getRepository(Category).find({
        relations: ["products"], // Liên kết với bảng sản phẩm
    });
    return getAllCategory;
};
