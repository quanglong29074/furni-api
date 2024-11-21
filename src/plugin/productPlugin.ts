import { Elysia, t } from "elysia";
import * as productService from "../service/productService";

const productPlugin = new Elysia().group("/product", (group) =>
  group
    .get(
      "/category/:id",
      async ({ params }: { params: { id: string } }) => {
        const categoryId = parseInt(params.id);
        const products = await productService.getProductsByCategoryId(
          categoryId
        );
        return {
          status: 200,
          data: products,
        };
      },
      {
        detail: {
          tags: ["Product"],
        },
      }
    )

    .get(
      "/productDetail/:id",
      async ({ params }: { params: { id: string } }) => {
        const productId = parseInt(params.id);
        const product = await productService.getProductById(productId);
        return {
          status: 200,
          data: product,
        };
      },
      {
        detail: {
          tags: ["Product"],
        },
      }
    )
    .get(
      "/related/:id",
      async ({ params }: { params: { id: string } }) => {
        const productId = parseInt(params.id);
        const relatedProducts = await productService.getRelatedProducts(
          productId
        );
        return {
          status: 200,
          data: relatedProducts,
        };
      },
      {
        detail: {
          tags: ["Product"],
        },
      }
    )
    .patch(
      "/updateQty/:productId",
      async ({
        params,
        body,
      }: {
        params: { productId: string };
        body: { qty: number };
      }) => {
        const productId = parseInt(params.productId);
        const { qty } = body;

        if (!productId || qty === undefined) {
          return {
            status: 400,
            message: "Product ID and qty are required",
          };
        }

        try {
          // Lấy số lượng sản phẩm hiện tại từ cơ sở dữ liệu
          const product = await productService.getProductById(productId);

          if (product.qty < qty) {
            return {
              status: 400,
              message: "Not enough stock",
            };
          }

          // Trừ đi số lượng sản phẩm từ giỏ hàng
          await productService.updateProductQty(productId, product.qty - qty);

          return {
            status: 200,
            message: "Product quantity updated successfully",
          };
        } catch (error) {
          const errorMessage = (error as Error).message;
          return {
            status: 500,
            message: `Error updating product quantity: ${errorMessage}`,
          };
        }
      },
      {
        detail: {
          tags: ["Order"],
        },
      }
    )
    .get(
      "/search",
      async ({ query }: { query: { name?: string } }) => {
        const name = query.name || ""; // Chuỗi tên sản phẩm người dùng nhập vào
        const products = await productService.searchProductsByName(name);
        
        return {
          status: 200,
          data: products,
        };
      },
      {
        detail: {
          tags: ["Product"],
          description: "Search for products by name",
          parameters: [
            {
              name: "name",
              in: "query",
              description: "Enter the product name to search",
              required: false,
              schema: { type: "string" },
            },
          ],
          responses: {
            200: {
              description: "List of products matching the search name",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "integer" },
                      data: {
                        type: "array",
                        items: { type: "object" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      }
    )    
    
    
);

export default productPlugin;
