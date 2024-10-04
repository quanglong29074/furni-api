import { Elysia, t } from 'elysia';
import * as productService from '../service/productService';

const productPlugin = new Elysia()
  .group("/product", (group) =>
    group
      .get("/", async () => {
        return await productService.getAllProduct();
      }, {
        detail: {
          tags: ['Product'],
        }
      })
      .get("/productDetail/:id", async ({ params }: { params: { id: string } }) => {
        const productId = parseInt(params.id); 
        const product = await productService.getProductById(productId);
        return {
            status: 200,
            data: product
        };
    }, {
        detail: {
            tags: ['Product'],
        }
    })    
  );

export default productPlugin;
