import express from "express";
import { askRouter } from "./routes/askRoutes.js";

const app = express();
app.use(express.json());
app.use("/ask", askRouter);

export { app };
