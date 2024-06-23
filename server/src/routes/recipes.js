import express from 'express';
import mongoose from 'mongoose';
import { RecipesModel } from '../models/Recipes.js';
import { verifyToken } from './users.js';

const router = express.Router();

// GET all recipes
router.get('/', async (req, res) => {
  try {
    const recipes = await RecipesModel.find({});
    res.status(200).json(recipes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create a new recipe
router.post('/', verifyToken, async (req, res) => {
  const { name, image, ingredients, instructions, imageUrl, cookingTime, userOwner } = req.body;

  const recipe = new RecipesModel({
    _id: new mongoose.Types.ObjectId(),
    name,
    image,
    ingredients,
    instructions,
    imageUrl,
    cookingTime,
    userOwner,
  });

  try {
    const result = await recipe.save();
    res.status(201).json({
      message: 'Recipe created successfully',
      createdRecipe: result,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET a recipe by ID
router.get('/:recipeId', async (req, res) => {
  try {
    const recipe = await RecipesModel.findById(req.params.recipeId);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    res.status(200).json(recipe);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update a recipe by ID
router.put('/:recipeId', async (req, res) => {
  const { recipeId } = req.params;
  const updateData = req.body;

  try {
    const updatedRecipe = await RecipesModel.findByIdAndUpdate(recipeId, updateData, { new: true });

    if (!updatedRecipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    return res.status(200).json({ updatedRecipe });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});



// DELETE a recipe by ID
router.delete('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;

  try {
    const deletedRecipe = await RecipesModel.findByIdAndDelete(id);

    if (!deletedRecipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    return res.status(200).json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});



export default router;
