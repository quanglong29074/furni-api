import { AppDataSource } from "../data-source";
import { OrderReturn } from "../entity/order_return";
import { ReturnImage } from "../entity/return_images";
import { User } from "../entity/user";
import { Order } from "../entity/order";
import { Product } from "../entity/product";

export const createOrderReturn = async ({
    user_id,
    order_id,
    product_id,
    qty,
    status = "pending", 
    reason,
    return_amount,
    description,
    images,
  }: {
    user_id: number;
    order_id: number;
    product_id: number;
    qty: number;
    status?: string; 
    reason: string;
    return_amount: number;
    description: string;
    images: string[]; // Array of image paths
  }) => {
    const userRepository = AppDataSource.getRepository(User);
    const orderRepository = AppDataSource.getRepository(Order);
    const productRepository = AppDataSource.getRepository(Product);
    const orderReturnRepository = AppDataSource.getRepository(OrderReturn);
    const returnImageRepository = AppDataSource.getRepository(ReturnImage);
  
    // Kiểm tra user
    const user = await userRepository.findOne({ where: { id: user_id } });
    if (!user) {
      throw new Error("User not found");
    }
  
    // Kiểm tra order
    const order = await orderRepository.findOne({ where: { id: order_id } });
    if (!order) {
      throw new Error("Order not found");
    }
  
    // Kiểm tra sản phẩm
    const product = await productRepository.findOne({ where: { id: product_id } });
    if (!product) {
      throw new Error("Product not found");
    }
  
    // Tạo yêu cầu hoàn trả với return_date
    const newOrderReturn = orderReturnRepository.create({
      user,
      order,
      product,
      qty,
      status, 
      reason,
      return_amount,
      description,
      return_date: new Date(), 
    });
    const savedOrderReturn = await orderReturnRepository.save(newOrderReturn);
  
    // Lưu ảnh hoàn trả
    const returnImages = images.map((imagePath) =>
      returnImageRepository.create({
        orderReturn: savedOrderReturn,
        image_path: imagePath,
      })
    );
    await returnImageRepository.save(returnImages);
  
    return {
      orderReturn: savedOrderReturn,
      images: returnImages,
    };
  };
  export const getProductsInOrderReturn = async () => {
    const orderReturnRepository = AppDataSource.getRepository(OrderReturn);
  
    const orderReturns = await orderReturnRepository.find({
      relations: ["product"], // Liên kết tới bảng Product
    });
  
    // Map kết quả để trả về sản phẩm chi tiết
    return orderReturns.map((orderReturn) => ({
      id: orderReturn.id,  // Đổi từ 'order_return_id' thành 'id'
      qty: orderReturn.qty,
      reason: orderReturn.reason,
      return_date: orderReturn.return_date,
      status: orderReturn.status,
      return_amount: orderReturn.return_amount,
      description: orderReturn.description,
      product: orderReturn.product, // Chi tiết sản phẩm
    }));
  };
  
  export const getOrderReturnDetails = async (order_return_id: number) => {
    const orderReturnRepository = AppDataSource.getRepository(OrderReturn);
    const returnImageRepository = AppDataSource.getRepository(ReturnImage);

    // Kiểm tra xem yêu cầu hoàn trả có tồn tại không
    const orderReturn = await orderReturnRepository.findOne({
        where: { id: order_return_id },
        relations: ["user", "order", "product"],
    });

    if (!orderReturn) {
        throw new Error("Order return not found"); // Hoặc trả về 404 nếu cần
    }

    // Lấy danh sách hình ảnh liên quan
    const images = await returnImageRepository.find({
        where: { orderReturn: { id: order_return_id } },
    });

    return {
        order_return_id: orderReturn.id,
        user: {
            id: orderReturn.user.id,
            name: orderReturn.user.user_name,
            email: orderReturn.user.email,
        },
        order: {
            id: orderReturn.order.id,
            order_date: orderReturn.order.order_date,
        },
        product: {
            id: orderReturn.product.id,
            product_name: orderReturn.product.product_name,
            price: orderReturn.product.price,
            thumbnail: orderReturn.product.thumbnail
        },
        qty: orderReturn.qty,
        reason: orderReturn.reason,
        return_amount: orderReturn.return_amount,
        description: orderReturn.description,
        return_date: orderReturn.return_date,
        status: orderReturn.status,
        images: images.map((img) => img.image_path),
    };
};
