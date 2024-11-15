// service/reviewService.ts
import { AppDataSource } from "../data-source";
import { OrderProduct } from "../entity/order_product";
import { Review } from "../entity/review";
import { Product } from "../entity/product";
import { User } from "../entity/user";

export const getReviewableProducts = async (userId: number) => {
  const orderProductRepository = AppDataSource.getRepository(OrderProduct);

  // Tìm các sản phẩm có thể đánh giá được dựa trên đơn hàng của người dùng
  const reviewableProducts = await orderProductRepository
    .createQueryBuilder("orderProduct")
    .leftJoinAndSelect("orderProduct.order", "order")
    .leftJoinAndSelect("orderProduct.product", "product") // Lấy toàn bộ thông tin product
    .where("order.user.id = :userId", { userId })
    .andWhere("order.status = :status", { status: "complete" })
    .select([
      "orderProduct.orderId",
      "orderProduct.productId",
      "orderProduct.qty",
      "orderProduct.price",
      "product", // Bao gồm toàn bộ thông tin của product
    ])
    .getMany();

  return reviewableProducts;
};
export const postReview = async (
  userId: number,
  productId: number,
  ratingValue: number,
  comment: string
) => {
  const reviewRepository = AppDataSource.getRepository(Review);
  const productRepository = AppDataSource.getRepository(Product);
  const userRepository = AppDataSource.getRepository(User);

  // Ensure user and product exist
  const user = await userRepository.findOneBy({ id: userId });
  const product = await productRepository.findOneBy({ id: productId });

  if (!user || !product) {
    throw new Error("User or Product not found");
  }

  // Create a new review entity
  const newReview = reviewRepository.create({
    user,
    product,
    comment,
    rating_value: ratingValue,
    review_date: new Date(),
    status: "pending", // Default to "pending" or any status you need
  });

  // Save the new review
  await reviewRepository.save(newReview);

  // Return the review with only the necessary fields
  return {
    productId: product.id, // Return only the productId
    comment: newReview.comment,
    status: newReview.status,
    review_date: newReview.review_date.toISOString(), // Ensure the date format is in ISO 8601 format
    rating_value: newReview.rating_value,
  };
};
export const getApprovedReviews = async (userId: number) => {
  const reviewRepository = AppDataSource.getRepository(Review);

  // Lấy các review của người dùng với status "approved"
  const approvedReviews = await reviewRepository
  .createQueryBuilder("review")
  .leftJoinAndSelect("review.product", "product") // Lấy toàn bộ thông tin của product
  .where("review.user.id = :userId", { userId })
  .andWhere("review.status = :status", { status: "approved" })
  .select([
    "review",  // Lấy toàn bộ thông tin của review
    "product", // Lấy toàn bộ thông tin của product
  ])
  .getMany();


  return approvedReviews;
};
// Lấy các review đã được approved của một sản phẩm theo productId
export const getReviewsByProductId = async (productId: number) => {
  const reviewRepository = AppDataSource.getRepository(Review);

  // Lấy các review của sản phẩm với status "approved"
  const reviews = await reviewRepository
    .createQueryBuilder("review")
    .leftJoinAndSelect("review.product", "product")  // Lấy thông tin sản phẩm (nếu cần)
    .leftJoinAndSelect("review.user", "user")  // Lấy thông tin người dùng
    .where("review.product.id = :productId", { productId })
    .andWhere("review.status = :status", { status: "approved" })
    .select([
      "review", // Trả về toàn bộ thông tin review
      "user",   // Trả về toàn bộ thông tin người dùng
    ])
    .getMany();

  return reviews;
};
