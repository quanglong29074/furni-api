import { Elysia, t } from "elysia";
import * as orderReturnService from "../service/orderReturnService";
import { isAuthenticated } from "../middleware/auth";

const orderReturnPlugin = new Elysia().group("/order-return", (group) =>
  group.post(
    "/create",
    async ({ headers, body }) => {
      const token = headers.authorization;
      const loggedUser = isAuthenticated(token);
      if (!loggedUser) {
        throw new Error("Authentication failed");
      }

      const {
        order_id,
        product_id,
        qty,
        reason,
        return_amount,
        description,
        images,
      } = body;

      const result = await orderReturnService.createOrderReturn({
        user_id: loggedUser.id,
        order_id,
        product_id,
        qty,
        reason,
        return_amount,
        description,
        images,
      });

      return {
        status: 200,
        message: "Order return created successfully",
        data: result,
      };
    },
    {
      detail: {
        tags: ["Order Return"],
        security: [{ JwtAuth: [] }],
      },
      body: t.Object({
        order_id: t.Number(),
        product_id: t.Number(),
        qty: t.Number(),
        reason: t.String(),
        return_amount: t.Number(),
        description: t.String(),
        images: t.Array(t.String()), // Array of image paths
      }),
    }
  )
  .get(
    "/list",
    async ({ headers }) => {
      const token = headers.authorization;
      const loggedUser = isAuthenticated(token);
      if (!loggedUser) {
        throw new Error("Authentication failed");
      }

      // Gọi service để lấy danh sách đơn hoàn trả
      const result = await orderReturnService.getProductsInOrderReturn();

      return {
        status: 200,
        message: "Order return list fetched successfully",
        data: result,
      };
    },
    {
      detail: {
        tags: ["Order Return"],
        security: [{ JwtAuth: [] }],
      },
    }
  )
  .get(
    "/details/:id",
    async ({ headers, params }) => {
      const token = headers.authorization;
      const loggedUser = isAuthenticated(token);
      if (!loggedUser) {
        throw new Error("Authentication failed");
      }

      const order_return_id = parseInt(params.id, 10);
      if (isNaN(order_return_id)) {
        throw new Error("Invalid order return ID");
      }

      // Gọi service để lấy chi tiết yêu cầu hoàn trả
      const result = await orderReturnService.getOrderReturnDetails(order_return_id);

      return {
        status: 200,
        message: "Order return details fetched successfully",
        data: result,
      };
    },
    {
      detail: {
        tags: ["Order Return"],
        security: [{ JwtAuth: [] }],
      },
    }
  )
);

export default orderReturnPlugin;
