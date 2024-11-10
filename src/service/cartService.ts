import { AppDataSource } from "../data-source";
import { Cart } from "../entity/cart";
import { Product } from "../entity/product";
import { User } from "../entity/user";

export const addToCart = async ({
  user_id,
  product_id,
  qty,
}: {
  user_id: number;
  product_id: number;
  qty: number;
}) => {
  const cartRepository = AppDataSource.getRepository(Cart);
  const userRepository = AppDataSource.getRepository(User);
  const productRepository = AppDataSource.getRepository(Product);

  // Kiểm tra xem người dùng có tồn tại không
  const user = await userRepository.findOne({ where: { id: user_id } });
  if (!user) {
    throw new Error("User not found");
  }

  // Kiểm tra xem sản phẩm có tồn tại không
  const product = await productRepository.findOne({
    where: { id: product_id },
  });
  if (!product) {
    throw new Error("Product not found");
  }

  // Kiểm tra xem sản phẩm đã tồn tại trong giỏ hàng chưa
  const existingCartItem = await cartRepository.findOne({
    where: { user: { id: user_id }, product: { id: product_id } },
  });

  if (existingCartItem) {
    // Nếu sản phẩm đã tồn tại trong giỏ hàng, cập nhật số lượng và tổng tiền
    existingCartItem.qty += qty;
    existingCartItem.total = existingCartItem.qty * product.price;
    await cartRepository.save(existingCartItem);
    return existingCartItem;
  } else {
    // Nếu sản phẩm chưa có trong giỏ hàng, tạo mới mục giỏ hàng
    const total = qty * product.price;

    const newCartItem = cartRepository.create({
      user: user,
      product: product,
      qty: qty,
      total: total,
    });

    await cartRepository.save(newCartItem);
    return newCartItem;
  }
};
export const updateCart = async ({
  user_id,
  product_id,
  qty,
}: {
  user_id: number;
  product_id: number;
  qty: number;
}) => {
  const cartRepository = AppDataSource.getRepository(Cart);
  const productRepository = AppDataSource.getRepository(Product);

  // Kiểm tra xem sản phẩm có tồn tại không
  const product = await productRepository.findOne({
    where: { id: product_id },
  });
  if (!product) {
    throw new Error("Product not found");
  }

  // Tìm mục giỏ hàng hiện tại
  const cartItem = await cartRepository.findOne({
    where: { user: { id: user_id }, product: { id: product_id } },
  });
  if (!cartItem) {
    throw new Error("Cart item not found");
  }

  // Cập nhật số lượng và tổng tiền
  cartItem.qty = qty;
  cartItem.total = qty * product.price;
  await cartRepository.save(cartItem);
  return cartItem;
};
export const removeFromCart = async ({
  user_id,
  product_id,
}: {
  user_id: number;
  product_id: number;
}) => {
  const cartRepository = AppDataSource.getRepository(Cart);

  // Tìm mục giỏ hàng hiện tại
  const cartItem = await cartRepository.findOne({
    where: { user: { id: user_id }, product: { id: product_id } },
  });
  if (!cartItem) {
    throw new Error("Cart item not found");
  }

  // Xóa sản phẩm khỏi giỏ hàng
  await cartRepository.remove(cartItem);
};
export const getCartByUserId = async (user_id: number) => {
  const cartRepository = AppDataSource.getRepository(Cart);

  // Lấy giỏ hàng của người dùng, bao gồm thông tin sản phẩm và danh mục sản phẩm
  const cartItems = await cartRepository.find({
    where: { user: { id: user_id } },
    relations: ["product", "product.category"], // Kết nối với bảng Product và Category
  });

  // Tính tổng tiền cho mỗi mục trong giỏ hàng
  const cartWithTotal = cartItems.map((item) => ({
    ...item,
    total: item.qty * item.product.price,
  }));

  return cartWithTotal;
};
export const clearCart = async (user_id: number) => {
  const cartRepository = AppDataSource.getRepository(Cart);

  // Xóa toàn bộ mục giỏ hàng của người dùng
  await cartRepository.delete({ user: { id: user_id } });
};
export const checkProductQty = async (product_id: number) => {
  const productRepository = AppDataSource.getRepository(Product);

  // Kiểm tra xem sản phẩm có tồn tại không
  const product = await productRepository.findOne({
    where: { id: product_id },
  });
  if (!product) {
    throw new Error("Product not found");
  }

  // Trả về số lượng sản phẩm còn lại trong kho
  return product.qty;
};
