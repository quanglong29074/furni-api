import { Elysia, t } from "elysia";
import * as favoriteService from "../service/favoriteService";
import { isAuthenticated } from "../middleware/auth";

const favoritePlugin = new Elysia().group("/favorite", (group) =>
  group
    .post(
      "/addToFavorite",
      async ({ headers, body }) => {
        const token = headers.authorization;
        const loggedUser = isAuthenticated(token);
        if (!loggedUser) {
          throw new Error("Authentication failed");
        }

        const { product_id } = body;
        const addToFavorite = await favoriteService.addToFavorite({
          user_id: loggedUser.id,
          product_id,
        });

        return {
          status: 200,
          data: addToFavorite,
        };
      },
      {
        detail: { 
            tags: ["Favorite"] ,
            security: [{ JwtAuth: [] }],
        },
        body: t.Object({
          product_id: t.Number(),
        }),
      }
    )
    .delete(
      "/removeFromFavorite",
      async ({ headers, body }) => {
        const token = headers.authorization;
        const loggedUser = isAuthenticated(token);
        if (!loggedUser) {
          throw new Error("Authentication failed");
        }

        const { product_id } = body;
        await favoriteService.removeFromFavorite({
          user_id: loggedUser.id,
          product_id,
        });

        return {
          status: 200,
          message: "Product removed from favorites successfully",
        };
      },
      {
        detail: { 
            tags: ["Favorite"] ,
            security: [{ JwtAuth: [] }],
        },
        body: t.Object({
          product_id: t.Number(),
        }),
      }
    )
    .get(
      "/getFavorites",
      async ({ headers }) => {
        const token = headers.authorization;
        const loggedUser = isAuthenticated(token);
        if (!loggedUser) {
          throw new Error("Authentication failed");
        }

        const favorites = await favoriteService.getFavoritesByUserId(loggedUser.id);

        return {
          status: 200,
          data: favorites,
        };
      },
      {
        detail: { 
            tags: ["Favorite"] ,
            security: [{ JwtAuth: [] }],
        },
      }
    )
);

export default favoritePlugin;
