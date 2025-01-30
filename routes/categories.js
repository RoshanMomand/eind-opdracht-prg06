import express from "express";
import Category from "../models/category.js";

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const categories = await Category.find({});
        res.status(200).json(categories);
    } catch (err) {
        res.status(400).json({err: err.message});
    }
});

router.post('/', async (req, res) => {
    try {
        const {name} = req.body;
        const newCategory = await Category.create({name});
        res.status(201).json(newCategory);
    } catch (err) {
        res.status(400).json({err: err.message});
    }
});

router.get('/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({message: "De categorie met dit ID bestaat niet."});
        }
        res.status(200).json(category);
    } catch (err) {
        res.status(401).json({err: err.message});
    }
});

// PUT /categories/:id - Bewerk een bestaande categorie
router.put('/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const {name} = req.body;

        const updatedCategory = await Category.findByIdAndUpdate(
            id,
            {name},
            {new: true, runValidators: true}
        );

        if (!updatedCategory) {
            return res.status(404).json({message: "De categorie met dit ID bestaat niet."});
        }

        res.status(200).json(updatedCategory);
    } catch (err) {
        res.status(400).json({err: err.message});
    }
});


router.delete('/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const deletedCategory = await Category.findByIdAndDelete(id);

        res.status(204).send();
    } catch (err) {
        res.status(500).json({err: err.message});
    }
});

export default router;