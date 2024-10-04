import { Product } from "../entity/product";
import { AppDataSource } from '../data-source';

export const getAllProduct = async () => {
    const products = await AppDataSource.getRepository(Product)
      .createQueryBuilder("product")
      .leftJoinAndSelect("product.category", "category")
      .leftJoinAndSelect("product.brand", "brand")
      .leftJoinAndSelect("product.material", "material")
      .leftJoinAndSelect("product.size", "size")
      .select([
        "product",
        "category.category_name",  // Lấy tên danh mục
        "brand.brand_name",        // Lấy tên thương hiệu
        "material.material_name",  // Lấy tên chất liệu
        "size.size_name"           // Lấy kích thước
      ])
      .getMany();

    return products;
}

export const getProductById = async (id: number) => { // Chuyển slug thành id
  const product = await AppDataSource.getRepository(Product)
    .createQueryBuilder("product")
    .leftJoinAndSelect("product.category", "category")
    .leftJoinAndSelect("product.brand", "brand")
    .leftJoinAndSelect("product.material", "material")
    .leftJoinAndSelect("product.size", "size")
    .select([
      "product",
      "category.category_name",  // Lấy tên danh mục
      "brand.brand_name",        // Lấy tên thương hiệu
      "material.material_name",  // Lấy tên chất liệu
      "size.size_name"           // Lấy kích thước
    ])
    .where("product.id = :id", { id }) // Sử dụng id để tìm sản phẩm
    .getOne();

  if (!product) {
      throw new Error("Product not found");
  }

  return product;
}

