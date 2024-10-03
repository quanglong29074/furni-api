import { Elysia, t } from 'elysia';
import * as productService from '../service/productService';


const productPlugin = new Elysia()
  .group("/product", (group) =>
    group
  .get("/", async ({  }) => {
    return await productService.getAllProduct();
  }, {
    detail: {
      tags: ['Product'],
    }
  })
  .get("/productDetail/:slug", async ({ params }) => {
    const product = await productService.getProductBySlug(params.slug);
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