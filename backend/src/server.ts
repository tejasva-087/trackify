/* eslint-disable no-console */
import "dotenv/config";
import app from "./app.js";

process.on("uncaughtException", (err: Error) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

const server = app.listen(process.env.PORT!, () => {
  console.log(`🚀 SERVER STARTED ON PORT: ${process.env.PORT!}`);
});

process.on("unhandledRejection", (err: Error) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
