import { Elysia, t } from "elysia";
import * as cartService from "../service/cartService";
import { isAuthenticated } from "../middleware/auth";

const cartPlugin = new Elysia().group("/cart", (group) =>
  group
    .post(
      "/addToCart",
      async ({ headers, body }) => {
        const token = headers.authorization;

        // Xác thực token
        const loggedUser = isAuthenticated(token);
        if (!loggedUser) {
          throw new Error("Authentication failed");
        }

        const { product_id, qty } = body;
        const addToCart = await cartService.addToCart({
          user_id: loggedUser.id, // Lấy user_id từ token
          product_id: product_id,
          qty: qty,
        });

        return {
          status: 200,
          data: addToCart,
        };
      },
      {
        detail: {
          tags: ["Cart"],
          security: [{ JwtAuth: [] }],
        },
        security: [{ JwtAuth: [] }],
        body: t.Object({
          product_id: t.Number(),
          qty: t.Number(),
        }),
      }
    )
    // API PUT để cập nhật số lượng sản phẩm trong giỏ hàng
    .put(
      "/updateCart",
      async ({ headers, body }) => {
        const token = headers.authorization;

        // Xác thực token
        const loggedUser = isAuthenticated(token);
        if (!loggedUser) {
          throw new Error("Authentication failed");
        }

        const { product_id, qty } = body;
        const updatedCartItem = await cartService.updateCart({
          user_id: loggedUser.id, // Lấy user_id từ token
          product_id: product_id,
          qty: qty,
        });

        return {
          status: 200,
          data: updatedCartItem,
        };
      },
      {
        detail: {
          tags: ["Cart"],
          security: [{ JwtAuth: [] }],
        },
        security: [{ JwtAuth: [] }],
        body: t.Object({
          product_id: t.Number(),
          qty: t.Number(),
        }),
      }
    )
    // API DELETE để xóa sản phẩm khỏi giỏ hàng
    .delete(
      "/removeFromCart",
      async ({ headers, body }) => {
        const token = headers.authorization;

        // Xác thực token
        const loggedUser = isAuthenticated(token);
        if (!loggedUser) {
          throw new Error("Authentication failed");
        }

        const { product_id } = body;
        await cartService.removeFromCart({
          user_id: loggedUser.id, // Lấy user_id từ token
          product_id: product_id,
        });

        return {
          status: 200,
          message: "Item removed from cart successfully",
        };
      },
      {
        detail: {
          tags: ["Cart"],
          security: [{ JwtAuth: [] }],
        },
        security: [{ JwtAuth: [] }],
        body: t.Object({
          product_id: t.Number(),
        }),
      }
    )
    // API GET để lấy giỏ hàng của người dùng
    .get(
      "/getCart",
      async ({ headers }) => {
        const token = headers.authorization;

        // Xác thực token
        const loggedUser = isAuthenticated(token);
        if (!loggedUser) {
          throw new Error("Authentication failed");
        }

        // Lấy giỏ hàng của người dùng từ cartService
        const cartItems = await cartService.getCartByUserId(loggedUser.id);
        return {
          status: 200,
          data: cartItems,
        };
      },
      {
        detail: {
          tags: ["Cart"],
          security: [{ JwtAuth: [] }],
        },
        security: [{ JwtAuth: [] }],
      }
    )
);

export default cartPlugin;
