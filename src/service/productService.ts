import { Product } from "../entity/product";
import { AppDataSource } from '../data-source';

export const getProductsByCategoryId = async (categoryId: number) => {
  const products = await AppDataSource.getRepository(Product)
    .createQueryBuilder("product")
    .leftJoinAndSelect("product.category", "category")
    .leftJoinAndSelect("product.brand", "brand")
    .leftJoinAndSelect("product.material", "material")
    .leftJoinAndSelect("product.size", "size")
    .where("category.id = :categoryId", { categoryId })
    .andWhere("product.deleted_at IS NULL") // Điều kiện chỉ lấy sản phẩm chưa bị xóa
    .select([
      "product",
      "category.category_name",
      "brand.brand_name",
      "material.material_name",
      "size.size_name"
    ])
    .getMany();

  return products.length > 0 ? products : []; // Trả về danh sách rỗng nếu không có sản phẩm
};




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
export const updateProductQty = async (productId: number, qty: number) => {
  const productRepository = AppDataSource.getRepository(Product);

  const product = await productRepository.findOneBy({ id: productId });

  if (!product) {
    throw new Error("Product not found");
  }

  // Cập nhật số lượng sản phẩm
  product.qty = qty;

  // Lưu lại thay đổi vào cơ sở dữ liệu
  await productRepository.save(product);
};
export const getRelatedProducts = async (productId: number) => {
  // Lấy sản phẩm hiện tại để tìm danh mục
  const product = await AppDataSource.getRepository(Product)
    .createQueryBuilder("product")
    .leftJoinAndSelect("product.category", "category")
    .where("product.id = :productId", { productId })
    .getOne();

  if (!product) {
    throw new Error("Product not found");
  }

  // Lấy các sản phẩm khác trong cùng một danh mục
  const relatedProducts = await AppDataSource.getRepository(Product)
    .createQueryBuilder("product")
    .leftJoinAndSelect("product.category", "category")
    .leftJoinAndSelect("product.brand", "brand")
    .leftJoinAndSelect("product.material", "material")
    .leftJoinAndSelect("product.size", "size")
    .where("category.id = :categoryId", { categoryId: product.category.id })
    .andWhere("product.id != :productId", { productId }) // Loại bỏ sản phẩm hiện tại
    .select([
      "product",
      "category.category_name",
      "brand.brand_name",
      "material.material_name",
      "size.size_name"
    ])
    .getMany();

  return relatedProducts.length > 0 ? relatedProducts : []; // Trả về danh sách rỗng nếu không có sản phẩm liên quan
}
export const searchProductsByName = async (name: string) => {
  const products = await AppDataSource.getRepository(Product)
    .createQueryBuilder("product")
    .leftJoinAndSelect("product.category", "category")
    .leftJoinAndSelect("product.brand", "brand")
    .leftJoinAndSelect("product.material", "material")
    .leftJoinAndSelect("product.size", "size")
    .select([
      "product",
      "category.category_name",
      "brand.brand_name",
      "material.material_name",
      "size.size_name",
    ])
    .where("product.product_name LIKE :name", { name: `%${name}%` })
    .andWhere("product.deleted_at IS NULL") // Thêm điều kiện kiểm tra deleted_at là NULL
    .getMany();

  return products;
};

