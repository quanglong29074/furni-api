import { AppDataSource } from "../data-source";
import { Order } from "../entity/order";
import { OrderProduct } from "../entity/order_product";
import { Product } from "../entity/product";
import { User } from "../entity/user";
import { v4 as uuidv4 } from "uuid";

export const createOrder = async (
  user_id: number,
  orderDetails: any,
  products: any[]
) => {
  const orderRepository = AppDataSource.getRepository(Order);
  const orderProductRepository = AppDataSource.getRepository(OrderProduct);
  const productRepository = AppDataSource.getRepository(Product);
  const userRepository = AppDataSource.getRepository(User);

  // Get the user information
  const user = await userRepository.findOne({ where: { id: user_id } });
  if (!user) {
    throw new Error("User not found");
  }

  if (products.length === 0) {
    throw new Error("No products provided");
  }

  const totalAmount = orderDetails.total; // Sử dụng total từ orderDetails
  const orderProducts: OrderProduct[] = [];

  // Process the products
  for (const { product_id, qty } of products) {
    const product = await productRepository.findOne({
      where: { id: product_id },
    });
    if (!product) {
      throw new Error(`Product with ID ${product_id} not found`);
    }

    const orderProduct = new OrderProduct();
    orderProduct.product = product;
    orderProduct.price = product.price;
    orderProduct.qty = qty;
    orderProduct.status = 0;

    orderProducts.push(orderProduct);
  }

  // Determine the payment status based on the payment method
  let isPaid = "0"; // Default to '0' for COD
  if (orderDetails.payment_method === "PayPal") {
    isPaid = "1"; // Set to '1' for PayPal
  }

  // Create the order
  const order = new Order();
  order.user = user;
  order.order_date = new Date();
  order.total_amount = totalAmount; // Sử dụng giá trị total do client gửi lên
  order.status = "pending";
  order.is_paid = isPaid;
  order.province = orderDetails.province;
  order.district = orderDetails.district;
  order.ward = orderDetails.ward;
  order.address_detail = orderDetails.address_detail;
  order.full_name = orderDetails.full_name;
  order.email = orderDetails.email;
  order.telephone = orderDetails.telephone;
  order.payment_method = orderDetails.payment_method;
  order.shipping_method = orderDetails.shipping_method;
  order.note = orderDetails.note && orderDetails.note.trim() !== "" ? orderDetails.note : null;
  order.schedule = orderDetails.schedule || null;
  order.cancel_reason = orderDetails.cancel_reason ? orderDetails.cancel_reason : null;

  // Generate a random order code (6 random uppercase letters)
  order.order_code = Math.random().toString(36).substring(2, 10).toUpperCase();

  // Generate a UUID for secure token
  order.secure_token = uuidv4();

  // Save the order
  await orderRepository.save(order);

  // Set orderProducts' order reference and save them
  for (const orderProduct of orderProducts) {
    orderProduct.order = order;
    await orderProductRepository.save(orderProduct);
  }

  return order;
};
// Hàm lấy đơn hàng theo status
export const getOrdersByStatus = async (status: string) => {
  const orderRepository = AppDataSource.getRepository(Order);
  const orderProductRepository = AppDataSource.getRepository(OrderProduct);
  
  // Tìm kiếm đơn hàng theo status
  const orders = await orderRepository.find({
    where: { status },
    relations: ["user"], // Nếu cần thông tin user kèm theo đơn hàng
  });

  // Lấy thông tin order theo status
  const ordersWithProducts = await Promise.all(orders.map(async (order) => {
    const orderProducts = await orderProductRepository.find({
      where: { orderId: order.id },
    });

    return {
      ...order,
      orderProducts,
    };
  }));

  return ordersWithProducts;
};
// Lấy thông tin đơn hàng theo id mà không cần OrderProduct
export const getOrderById = async (orderId: number) => {
  const orderRepository = AppDataSource.getRepository(Order);
  
  // Tìm kiếm đơn hàng theo orderId
  const order = await orderRepository.findOne({
    where: { id: orderId },
    relations: ["user"], // Nếu cần thông tin user kèm theo đơn hàng
  });

  if (!order) {
    throw new Error("Order not found");
  }

  // Trả về nguyên bản đối tượng order mà không cần liệt kê thông tin
  return order;
};

// Hàm lấy thông tin OrderProduct theo orderId
export const getOrderProductsByOrderId = async (orderId: number) => {
  const orderProductRepository = AppDataSource.getRepository(OrderProduct);

  // Tìm kiếm các sản phẩm của đơn hàng theo orderId
  const orderProducts = await orderProductRepository.find({
    where: { orderId: orderId },
    relations: ["product"], // Quan hệ với sản phẩm nếu cần lấy thông tin chi tiết sản phẩm
  });

  if (!orderProducts) {
    throw new Error('No products found for this order');
  }

  return orderProducts;
};
// Update order status
export const updateOrderStatus = async (orderId: number, newStatus: string, cancelReason?: string) => {
  const orderRepository = AppDataSource.getRepository(Order);

  // Find the order by ID
  const order = await orderRepository.findOne({ where: { id: orderId } });
  if (!order) {
    throw new Error("Order not found");
  }

  // Update status and cancel reason if provided
  order.status = newStatus;
  if (newStatus === "cancel" && cancelReason) {
    order.cancel_reason = cancelReason;
  } else if (newStatus !== "cancel") {
    order.cancel_reason = null; // Clear cancel reason if not canceled
  }

  // Save the updated order
  await orderRepository.save(order);

  return order;
};