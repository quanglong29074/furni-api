import { Category } from "../entity/category";
import { AppDataSource } from '../data-source';

export const getAllCategory = async () => {
    const getAllCategory = await AppDataSource.getRepository(Category).find({
    });
    return getAllCategory;
};
