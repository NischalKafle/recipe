import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { userRouter } from "./routes/users.js";
import recipesRouter from "./routes/recipes.js";
import commentsRouter from "./routes/comments.js";

const app = express();

app.use(express.json());
app.use(cors());

// Routes
app.use("/auth", userRouter);  // Mount userRouter at /auth
app.use("/recipes", recipesRouter);  // Mount recipesRouter at /recipes
app.use("/comments", commentsRouter);  // Mount commentsRouter at /comments

// MongoDB connection
mongoose.connect("mongodb+srv://nischal_kafle:YREiRzpiDxhb66bP@recipe.yrorp0z.mongodb.net/recipe?retryWrites=true&w=majority&appName=recipe", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch((err) => console.error("MongoDB connection error:", err));

// Start server
app.listen(3001, () => console.log("Server started"));
