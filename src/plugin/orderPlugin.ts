import { Elysia, t } from 'elysia';
import * as orderService from '../service/orderService';
import { isAuthenticated } from '../middleware/auth';

const orderPlugin = new Elysia().group("/order", (group) =>
  group
    .post(
      "/createOrder",
      async ({ headers, body }) => {
        const token = headers.authorization;

        // Xác thực token
        const loggedUser = isAuthenticated(token);
        if (!loggedUser) {
          throw new Error("Authentication failed");
        }

        const { orderDetails, products } = body;

        try {
          const newOrder = await orderService.createOrder(loggedUser.id, orderDetails, products);
          return {
            status: 200,
            data: newOrder,
          };
        } catch (error: unknown) {
          if (error instanceof Error) {
            return {
              status: 400,
              message: error.message,
            };
          }
          return {
            status: 400,
            message: 'An unknown error occurred',
          };
        }
      },
      {
        detail: {
          tags: ["Order"],
          security: [{ JwtAuth: [] }],
        },
        security: [{ JwtAuth: [] }],
        body: t.Object({
          orderDetails: t.Object({
            province: t.String(),
            district: t.String(),
            ward: t.String(),
            address_detail: t.String(),
            full_name: t.String(),
            email: t.String(),
            telephone: t.String(),
            payment_method: t.String(),
            shipping_method: t.String(),
            note: t.Optional(t.String()),
            schedule: t.Optional(t.String()),
            cancel_reason: t.Optional(t.String()),
            total: t.Number(), // Thêm total vào orderDetails
          }),
          products: t.Array(
            t.Object({
              product_id: t.Number(),
              qty: t.Number(),
            })
          ),
        }),
      }
    )
);

export default orderPlugin;
