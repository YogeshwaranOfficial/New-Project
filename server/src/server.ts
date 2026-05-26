import app from "./app.js";

import env from "./config/env.js";

import { sequelize, syncDatabase } from "./database/index.js";

const startServer = async (): Promise<void> => {
  try {
    await sequelize.authenticate();

    console.log("✅ Database connected successfully");

    await syncDatabase();

    app.listen(env.PORT, () => {
      console.log(
        `🚀 Server running on port ${env.PORT} in ${env.NODE_ENV} mode`
      );
    });
  } catch (error) {
    console.error("❌ Server startup failed:", error);

    process.exit(1);
  }
};

void startServer();