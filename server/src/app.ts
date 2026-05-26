import express, {
  type Application,
  type Request,
  type Response,
} from "express";

import cors from "cors";

import helmet from "helmet";

import morgan from "morgan";

import cookieParser from "cookie-parser";

import env from "./config/env.js";

import notFoundHandler from "./middlewares/notFoundHandler.js";

import globalErrorHandler from "./middlewares/globalErrorHandler.js";

import routes from "./routes/index.js";


const app: Application = express();



/* -------------------------------------------------------------------------- */
/*                                 MIDDLEWARES                                */
/* -------------------------------------------------------------------------- */

app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(helmet());

app.use(morgan("dev"));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(notFoundHandler);

app.use(globalErrorHandler);

/* -------------------------------------------------------------------------- */
/*                                   ROUTES                                   */
/* -------------------------------------------------------------------------- */

app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Library Management System API running successfully",
  });
});


app.use("/api/v1", routes);



export default app;