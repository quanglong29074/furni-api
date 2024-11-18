// routes/notificationPlugin.ts
import { Elysia, t } from "elysia";
import * as notificationService from "../service/notificationService";
import { isAuthenticated } from "../middleware/auth";

const notificationPlugin = new Elysia().group("/notification", (group) =>
  group
    .get(
      "/getNotifications",
      async ({ headers }) => {
        const token = headers.authorization;
        const loggedUser = isAuthenticated(token);
        if (!loggedUser) {
          throw new Error("Authentication failed");
        }

        const notifications = await notificationService.getNotificationsByUserId(
          loggedUser.id
        );

        return {
          status: 200,
          data: notifications,
        };
      },
      {
        detail: {
          tags: ["Notification"],
          security: [{ JwtAuth: [] }],
        },
      }
    )
);

export default notificationPlugin;
