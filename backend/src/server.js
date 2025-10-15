import express from "express";
import path from "path";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.route.js";
import messagesRoutes from "./routes/messages.route.js";
import { connectDB } from "./lib/db.js";
import { ENV } from "./lib/env.js";

const app = express();
const __dirname = path.resolve();

const PORT = ENV.PORT || 3000;

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messagesRoutes);

if (ENV.NODE_ENV === "development") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });

  // app.get("/", (req, res) => {
  //   res.send("🚀 ChatApp backend running successfully!");
  // });
}

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
  connectDB();
});
