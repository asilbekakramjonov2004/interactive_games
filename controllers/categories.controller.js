const { errorHandler } = require("../helpers/error_handler")
const Categories = require("../models/categories.model")
const bcrypt = require('bcrypt');
const { categoriesValidation } = require("../validation/categories.validation");


const addNewCategory =  async (req, res) => {
    try {
        const {error, value} = categoriesValidation(req.body)
        if(error) {
            errorHandler(error, res)
        }
        const {name, description} = value

        const newCategory = await Categories.create({name, description})
        res.status(201).send({message: "New category added", newCategory})
    } catch (error) {
        errorHandler(error, res)
    }

}

const findAllCategories = async (req, res) => {
    try {
        const categories = await Categories.findAll();
        res.status(200).send({categories})
    } catch (error) {
        errorHandler(error, res)
    }
}

const findByIdCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Categories.findByPk(id);

        if (!category) {
        return res.status(404).json({ message: "Category not found" });
            }

        res.status(200).json(category);
    } catch (error) {
        errorHandler(error, res)
    }
}

const updateCategory = async (req, res) => {
    try {
        const {error, value} = categoriesValidation(req.body)
        if(error) {
            errorHandler(error, res)
        }
        const {id} = req.params;
        const {name, description} = value

        const category = await Categories.findByPk(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    await category.update({ name, description });

    res.status(200).json({ message: "Category updated", category });
    } catch (error) {
        errorHandler(error, res)
    }
}

const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

    const category = await Categories.findByPk(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    await category.destroy();
    } catch (error) {
        errorHandler(error, res)
    }
}

module.exports = {
    addNewCategory,
    findAllCategories,
    findByIdCategory,
    updateCategory,
    deleteCategory
}