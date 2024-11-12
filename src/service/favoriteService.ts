import { AppDataSource } from "../data-source";
import { Favorite } from "../entity/favorite";
import { Product } from "../entity/product";
import { User } from "../entity/user";

export const addToFavorite = async ({
  user_id,
  product_id,
}: {
  user_id: number;
  product_id: number;
}) => {
  const favoriteRepository = AppDataSource.getRepository(Favorite);
  const userRepository = AppDataSource.getRepository(User);
  const productRepository = AppDataSource.getRepository(Product);

  const user = await userRepository.findOne({ where: { id: user_id } });
  if (!user) throw new Error("User not found");

  const product = await productRepository.findOne({ where: { id: product_id } });
  if (!product) throw new Error("Product not found");

  const existingFavorite = await favoriteRepository.findOne({
    where: { user: { id: user_id }, product: { id: product_id } },
  });
  if (existingFavorite) throw new Error("Product already in favorites");

  const newFavorite = favoriteRepository.create({ user, product });
  await favoriteRepository.save(newFavorite);
  return newFavorite;
};

export const removeFromFavorite = async ({
  user_id,
  product_id,
}: {
  user_id: number;
  product_id: number;
}) => {
  const favoriteRepository = AppDataSource.getRepository(Favorite);

  const favoriteItem = await favoriteRepository.findOne({
    where: { user: { id: user_id }, product: { id: product_id } },
  });
  if (!favoriteItem) throw new Error("Favorite item not found");

  await favoriteRepository.remove(favoriteItem);
};

export const getFavoritesByUserId = async (user_id: number) => {
  const favoriteRepository = AppDataSource.getRepository(Favorite);

  const favorites = await favoriteRepository.find({
    where: { user: { id: user_id } },
    relations: ["product", "product.category"],  
  });


  return favorites.map(favorite => {
    return {
      ...favorite,
      product: {
        ...favorite.product,
        category: favorite.product.category, 
      },
    };
  });
};
