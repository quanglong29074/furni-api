import { Elysia, t } from 'elysia';
import * as cartService from '../service/cartService';
import { isAuthenticated } from '../middleware/auth';


const cartPlugin = new Elysia()
  .group("/cart", (group) =>
    group
  .post("/addToCart", async ({ headers, body }) => {
    const token = headers.authorization;

    // Xác thực token
    const loggedUser = isAuthenticated(token);
    if (!loggedUser) {
      throw new Error('Authentication failed');
    }

    const { product_id, qty } = body;
    const addToCart =  await cartService.addToCart({
      user_id: loggedUser.id, // Lấy user_id từ token
      product_id: product_id,
      qty: qty
    });
    return {
      status: 200,
      data: addToCart
    };
  }, {
    detail: {
      tags: ['Cart'],
      security: [
        { JwtAuth: [] }
      ],
    },
     security: [
            { JwtAuth: [] }
          ],
    body: t.Object({
      product_id: t.Number(),
      qty: t.Number()
    })
  }));


export default cartPlugin;