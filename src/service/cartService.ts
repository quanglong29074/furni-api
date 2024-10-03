import { AppDataSource } from '../data-source';
import { Cart } from '../entity/cart';
import { Product } from '../entity/product';
import { User } from '../entity/user';

export const addToCart = async ({ user_id, product_id, qty }: { user_id: number, product_id: number, qty: number }) => {
    const cartRepository = AppDataSource.getRepository(Cart);
    const userRepository = AppDataSource.getRepository(User);
    const productRepository = AppDataSource.getRepository(Product);

    // Kiểm tra xem người dùng có tồn tại không
    const user = await userRepository.findOne({ where: { id: user_id } });
    if (!user) {
        throw new Error('User not found');
    }

    // Kiểm tra xem sản phẩm có tồn tại không
    const product = await productRepository.findOne({ where: { id: product_id } });
    if (!product) {
        throw new Error('Product not found');
    }

    // Kiểm tra xem sản phẩm đã tồn tại trong giỏ hàng chưa
    const existingCartItem = await cartRepository.findOne({ where: { user: { id: user_id }, product: { id: product_id } } });

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
            total: total
        });

        await cartRepository.save(newCartItem);
        return newCartItem;
    }
};
