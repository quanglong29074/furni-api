import { Elysia, t } from "elysia";
import * as cartService from "../service/cartService";
import { isAuthenticated } from "../middleware/auth";

const cartPlugin = new Elysia().group("/cart", (group) =>
  group
    .post(
      "/addToCart",
      async ({ headers, body }) => {
        const token = headers.authorization;
        const loggedUser = isAuthenticated(token);
        if (!loggedUser) {
          throw new Error("Authentication failed");
        }
        const { product_id, qty } = body;
        const addToCart = await cartService.addToCart({
          user_id: loggedUser.id,
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
          tags: ["Cart"] ,
          security: [{ JwtAuth: [] }],
        },
        body: t.Object({
          product_id: t.Number(),
          qty: t.Number(),
        }),
      }
    )
    .put(
      "/updateCart",
      async ({ headers, body }) => {
        const token = headers.authorization;
        const loggedUser = isAuthenticated(token);
        if (!loggedUser) {
          throw new Error("Authentication failed");
        }
        const { product_id, qty } = body;
        const updatedCartItem = await cartService.updateCart({
          user_id: loggedUser.id,
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
          tags: ["Cart"] ,
          security: [{ JwtAuth: [] }],
        },
        body: t.Object({
          product_id: t.Number(),
          qty: t.Number(),
        }),
      }
    )
    .delete(
      "/removeFromCart",
      async ({ headers, body }) => {
        const token = headers.authorization;
        const loggedUser = isAuthenticated(token);
        if (!loggedUser) {
          throw new Error("Authentication failed");
        }
        const { product_id } = body;
        await cartService.removeFromCart({
          user_id: loggedUser.id,
          product_id: product_id,
        });
        return {
          status: 200,
          message: "Item removed from cart successfully",
        };
      },
      {
        detail: { 
          tags: ["Cart"] ,
          security: [{ JwtAuth: [] }],
        },
        body: t.Object({
          product_id: t.Number(),
        }),
      }
    )
    .get(
      "/getCart",
      async ({ headers }) => {
        const token = headers.authorization;
        const loggedUser = isAuthenticated(token);
        if (!loggedUser) {
          throw new Error("Authentication failed");
        }
        const cartItems = await cartService.getCartByUserId(loggedUser.id);
        return {
          status: 200,
          data: cartItems,
        };
      },
      {
        detail: { 
          tags: ["Cart"] ,
          security: [{ JwtAuth: [] }],
        },
      }
    )
    .delete(
      "/clearCart",
      async ({ headers }) => {
        const token = headers.authorization;
        const loggedUser = isAuthenticated(token);
        if (!loggedUser) {
          throw new Error("Authentication failed");
        }
        await cartService.clearCart(loggedUser.id);
        return {
          status: 200,
          message: "Cart cleared successfully",
        };
      },
      {
        detail: { 
          tags: ["Cart"] ,
          security: [{ JwtAuth: [] }],
        },
      }
    )
    .get(
      "/checkProductQty/:productId",
      async ({ params }) => {
        const { productId } = params;
        const availableQty = await cartService.checkProductQty(parseInt(productId));
        return {
          status: 200,
          data: { availableQty },
        };
      },
      {
        detail: { tags: ["Cart"] },
      }
    )
);

export default cartPlugin;
