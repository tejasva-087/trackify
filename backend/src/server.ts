import "dotenv/config";
import app from "./app.js";
import { checkDbConnection } from "./lib/db.js";

process.on("uncaughtException", (err: Error) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

async function startServer() {
  try {
    await checkDbConnection();
    console.log("✅ Database connected");

    // Convert PORT to a base-10 number, fallback to 5000 if undefined
    const PORT = parseInt(process.env.PORT!, 10);

    // Express now matches the exact overload: (number, string, callback)
    const server = app.listen(PORT, "10.97.168.48", () => {
      console.log(
        `🚀 Backend running locally and on network interface: http://10.97.168.48:${PORT}`,
      );
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
