import { Elysia, t } from 'elysia';
import jwt from 'jsonwebtoken';
import * as userService from '../service/userService';
import { isAuthenticated } from '../middleware/auth'; // Import hàm xác thực

const userPlugin = new Elysia()
  .group("/user", (group) =>
    group
      .post("/login", async ({ body }) => {
        return await userService.login(body);
      }, {
        detail: {
          tags: ['User'],
        },
        body: t.Object({
          email: t.String(),
          password: t.String()
        })
      })
      .post("/register", async ({ body }) => {
        return await userService.register(body);
      }, {
        detail: {
          tags: ['User'],
        },
        body: t.Object({
          full_name: t.String(),
          email: t.String(),
          password: t.String()
        })
      })
      .post("/change-password", async ({ body, headers }) => {
        // Lấy token từ headers
        const token = headers.authorization;

        // Xác thực token
        const loggedUser = isAuthenticated(token);
        if (!loggedUser) {
          throw new Error('Authentication failed');
        }
    
const {oldPassword, newPassword, confirmNewPassword} = body
        try {

          const user = await userService.changePassword(
             oldPassword,newPassword,confirmNewPassword, loggedUser.id,
          );
          return  user;

        } catch (error) {
          throw new Error("Invalid token");
        }
      }, {
        detail: {
          tags: ['User'],
          security: [
            { JwtAuth: [] } // Thêm security
          ],
        },
        body: t.Object({
          oldPassword: t.String(),
          newPassword: t.String(),
          confirmNewPassword: t.String()
        })
      })
  );

export default userPlugin;
