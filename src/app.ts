import * as dotenv from "dotenv";
dotenv.config();
import http from "http";
import cors from "cors";
import helmet from "helmet";
import express, { Application, NextFunction, Request, Response } from "express";
import limiter from "./middlewares/rate-limit.middleware";
import { errorHandler, notFoundHandler } from "./middlewares/error.middleware";
import { API_VERSION_1 } from "./utils/constants";
import LoggerMiddleware from "./middlewares/logger.middleware";
import sequelize from "./models";
import paymentRoutes from "./routes/payment.routes";

const PORT = process.env.PORT || 8000;

const app: Application = express();
const server = http.createServer(app);
app.use(cors());

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(limiter);

app.use(LoggerMiddleware.httpLogger);

app.get(API_VERSION_1, paymentRoutes);
app.get(
  `${API_VERSION_1}`,
  (req: Request, res: Response, next: NextFunction) => {
    res.json({ message: "Hello world" });
  }
);

app.all("*", notFoundHandler);
app.use(errorHandler);

const init = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    server.listen(PORT, () => {
      // if(process.env.NODE_ENV === "production")
      console.log(`App listening on port:${PORT}`);
    });

  } catch (err) {
    process.exit(1);
  }
};

init();

process.on("SIGTERM", () => {
  server.close(() => {
    console.log("Server gracefully shut down");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  server.close(() => {
    console.log("Server interrupted. Shutting down");
    process.exit(1);
  });
});
