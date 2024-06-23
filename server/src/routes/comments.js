import express from "express";
import mongoose from "mongoose";
import { CommentModel } from "../models/Comment.js";
import { verifyToken } from "./users.js";

const router = express.Router();

// GET all comments for a recipe
router.get("/:recipeId", async (req, res) => {
  try {
    const comments = await CommentModel.find({ recipeId: req.params.recipeId });
    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create a new comment and rating for a recipe
router.post("/", verifyToken, async (req, res) => {
  const { recipeId, user, comment, rating } = req.body;

  const newComment = new CommentModel({
    recipeId,
    user,
    comment,
    rating,
  });

  try {
    const result = await newComment.save();
    res.status(201).json({
      message: "Comment added successfully",
      createdComment: result,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update a comment by ID
router.put("/:commentId", verifyToken, async (req, res) => {
  const { commentId } = req.params;
  const updateData = req.body;

  try {
    const updatedComment = await CommentModel.findByIdAndUpdate(commentId, updateData, { new: true });

    if (!updatedComment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    return res.status(200).json({ updatedComment });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// DELETE a comment by ID
router.delete("/:commentId", verifyToken, async (req, res) => {
  const { commentId } = req.params;

  try {
    const deletedComment = await CommentModel.findByIdAndDelete(commentId);

    if (!deletedComment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    return res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
