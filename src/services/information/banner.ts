import { queryGet } from "../helper/queryHelper";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

export const getBanner = async () => {
  const banner = await queryGet(
    `SELECT banner_name, banner_image, description FROM banner`
  );

  return banner.map((item) => {
    if (item.banner_image) {
      item.banner_image = `${BASE_URL}/public/${item.banner_image}`;
    }
    return item;
  });
};
