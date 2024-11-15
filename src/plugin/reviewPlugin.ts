// routes/reviewPlugin.ts
import { Elysia, t } from "elysia";
import * as reviewService from "../service/reviewService";
import { isAuthenticated } from "../middleware/auth";

const reviewPlugin = new Elysia().group("/review", (group) =>
  group
    .get(
      "/getReviewableProducts",
      async ({ headers }) => {
        const token = headers.authorization;
        const loggedUser = isAuthenticated(token);
        if (!loggedUser) {
          throw new Error("Authentication failed");
        }

        const reviewableProducts = await reviewService.getReviewableProducts(
          loggedUser.id
        );

        return {
          status: 200,
          data: reviewableProducts,
        };
      },
      {
        detail: {
          tags: ["Review"],
          security: [{ JwtAuth: [] }],
        },
      }
    )
    .post(
      "/postReview",
      async ({ headers, body }) => {
        const token = headers.authorization;
        const loggedUser = isAuthenticated(token);
        if (!loggedUser) {
          throw new Error("Authentication failed");
        }

        const { productId, ratingValue, comment } = body;

        if (!productId || !ratingValue) {
          throw new Error("Product ID and Rating Value are required");
        }

        const newReview = await reviewService.postReview(
          loggedUser.id,
          productId,
          ratingValue,
          comment ?? ""
        );

        return {
          status: 201,
          message: "Review posted successfully",
          data: newReview, // Return the filtered review data
        };
      },
      {
        body: t.Object({
          productId: t.Number(),
          ratingValue: t.Number({ minimum: 1, maximum: 5 }), // Assuming rating is 1 to 5
          comment: t.Optional(t.String()),
        }),
        detail: {
          tags: ["Review"],
          security: [{ JwtAuth: [] }],
        },
      }
    )
    .get(
      "/getApprovedReviews",
      async ({ headers }) => {
        const token = headers.authorization;
        const loggedUser = isAuthenticated(token);
        if (!loggedUser) {
          throw new Error("Authentication failed");
        }

        // Lấy các review có status 'approved' của người dùng hiện tại
        const approvedReviews = await reviewService.getApprovedReviews(loggedUser.id);

        return {
          status: 200,
          data: approvedReviews,
        };
      },
      {
        detail: {
          tags: ["Review"],
          security: [{ JwtAuth: [] }],
        },
      }
    )
    .get(
      "/getReviewsByProductId/:productId",  // Thêm route này
      async ({ params, headers }) => {
        const token = headers.authorization;
        const loggedUser = isAuthenticated(token);
        if (!loggedUser) {
          throw new Error("Authentication failed");
        }
    
        const { productId } = params;
    
        // Chuyển productId từ string thành number
        const productIdNumber = parseInt(productId, 10);
        
        // Kiểm tra nếu productId không phải là số hợp lệ
        if (isNaN(productIdNumber)) {
          throw new Error("Invalid product ID");
        }
    
        // Lấy các review của sản phẩm với productId và status là "approved"
        const approvedReviews = await reviewService.getReviewsByProductId(productIdNumber);
        const reviewData = approvedReviews.map(review => ({
          review: review,  
        }));
    
        return {
          status: 200,
          data: reviewData,
        };
      },
      {
        params: t.Object({
          productId: t.String(),
        }),
        detail: {
          tags: ["Review"],
          security: [{ JwtAuth: [] }],
        },
      }
    )
    
);

export default reviewPlugin;
