import { Elysia, error, t } from 'elysia';
import { swagger } from '@elysiajs/swagger';
import { cors } from '@elysiajs/cors'
import mysql from 'mysql2/promise'
import "reflect-metadata";
import { AppDataSource } from './data-source'; // Import AppDataSource
import categoryPlugin from './plugin/categoryPlugin';
import userPlugin from './plugin/userPlugin';
import productPlugin from './plugin/productPlugin';
import cartPlugin from './plugin/cartPlugin';
import orderPlugin from './plugin/orderPlugin';
import favoritePlugin from './plugin/favoritePlugin';
import reviewPlugin from './plugin/reviewPlugin';
import notificationPlugin from './plugin/notificationPlugin';
import orderReturnPlugin from './plugin/orderReturnPlugin';
// Tạo kết nối tới MySQL trên XAMPP
await AppDataSource.initialize()
    .then(() => {
      console.log('Data Source has been initialized!');
    })
    .catch((err) => {
      console.error('Error during Data Source initialization:', err);
    });


const app = new Elysia()
  .use(swagger({
    path: '/swagger-ui',
    provider: 'swagger-ui',
    documentation: {
      info: {
        title: 'Elysia template',
        description: 'Elysia template API Documentation',
        version: '1.0.0',
      },
      components: {
        securitySchemes: {
          JwtAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            description: 'Enter JWT Bearer token **_only_**'
          }
        }
      },
    },
    swaggerOptions: {
      persistAuthorization: true,
    }
  }))
  .group("/api", (group) =>
    group
      .use(userPlugin)
      .use(categoryPlugin)
      .use(productPlugin)
      .use(cartPlugin)
      .use(orderPlugin)
      .use(favoritePlugin)
      .use(reviewPlugin)
      .use(notificationPlugin)
      .use(orderReturnPlugin)

  //add more plugins here
)
.listen(3000);
 app.use(cors({
  }));
console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
