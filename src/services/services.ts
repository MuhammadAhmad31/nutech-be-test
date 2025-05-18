import { queryGet } from "./helper/queryHelper"


export const getServices = async () => {
    const service = await queryGet(
        `SELECT service_code, service_name, service_icon, service_tariff FROM service`,
    )

    return service.map((item) => {
        if (item.service_icon) {
            item.service_icon = `${process.env.BASE_URL}/public/${item.service_icon}`;
        }
        return item;
    });
}