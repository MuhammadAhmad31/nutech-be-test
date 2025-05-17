import express from "express";
import cors from "cors";
import { Request, Response, NextFunction } from "express";
import { logMiddlewareRequest } from "./middleware/logs";
import dotenv from "dotenv";
import routes from "./routes";
import { response_internal_server_error, response_not_found } from "./utils/response.utils";
dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());

app.use(cors({
  origin: "*",
  credentials: true,
}));

app.use(logMiddlewareRequest);
app.use("/assets", express.static("public/images"));

app.use("/", routes);

app.use((req: Request, res: Response) => {
  return response_not_found(res, "URL tidak ditemukan");
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  return response_internal_server_error(res, "Terjadi kesalahan pada server");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
