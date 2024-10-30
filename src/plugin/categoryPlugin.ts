import { Elysia, t } from 'elysia';
import * as categoryService from '../service/categoryService';


const categoryPlugin = new Elysia()
  .group("/category", (group) =>
    group
  .get("/", async ({  }) => {
    return await categoryService.getAllCategory();
  }, {
    detail: {
      tags: ['Category'],
    }
  })
      
     
  );

export default categoryPlugin;