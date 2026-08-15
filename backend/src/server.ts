import "dotenv/config";
import app from "./app.js";
import { checkDbConnection } from "./lib/db.js";

process.on("uncaughtException", (err: Error) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

const PORT = process.env.PORT;

async function startServer() {
  try {
    await checkDbConnection();
    console.log("✅ Database connected");

    const server = app.listen(PORT, () => {
      console.log(`🚀 SERVER STARTED ON PORT: ${process.env.PORT}`);
    });

    process.on("unhandledRejection", (err: Error) => {
      console.log("UNHANDLED REJECTION! 💥 Shutting down...");
      console.log(err.name, err.message);
      server.close(() => {
        process.exit(1);
      });
    });
  } catch (err) {
    console.log("❌ FAILED TO CONNECT TO DATABASE. Shutting down...");
    console.log(err);
    process.exit(1);
  }
}

startServer();
