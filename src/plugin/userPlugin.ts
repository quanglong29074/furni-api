import { Elysia, t } from 'elysia';
import * as userService from '../service/userService';


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
      
     
  );

export default userPlugin;