import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, ".env") });

app.use(express.static(path.join(__dirname, 'src')));


app.use(
  cors({
    origin: "*",
    allowedHeaders: ["Content-Type", "Authorization"], // Specify allowed headers
    credentials: true, // Allow credentials
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = process.env.NODE_ENV === 'production' ? process.env.PORT : 5000;

import userRoutes from "./routes/user.route.js";

app.use("/api/v1/DocGuard", userRoutes);

// Improved error handling for app.listen
app.listen(PORT, (error) => {
  if (error) {
    console.error("Error starting the server:", error);
    process.exit(1); // Exit the process with a failure code
  } else {
    console.log(`Server is running on port ${PORT} in ${process.env.NODE_ENV} mode`);
  }
});
