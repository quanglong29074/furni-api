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

        // Kiểm tra sự tồn tại của token
        if (!token) {
          throw new Error("Token is missing");
        }

        // Xác thực token
        const loggedUser = isAuthenticated(token);
        if (!loggedUser) {
          throw new Error('Authentication failed');
        }

        try {
          // Giải mã token để lấy userId
          const decoded: any = jwt.verify(token.split(' ')[1], 'your_jwt_secret'); // Thay 'your_jwt_secret' bằng secret của bạn
          const userId = decoded.id;

          return await userService.changePassword({
            userId,
            oldPassword: body.oldPassword,
            newPassword: body.newPassword,
            confirmNewPassword: body.confirmNewPassword
          });
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
