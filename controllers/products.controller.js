const { errorHandler } = require("../helpers/error_handler")
const Products = require("../models/products.model")
const bcrypt = require('bcrypt');
const { productValidation } = require("../validation/product.validation");


const addNewProduct =  async (req, res) => {
    try {
        const {error, value} = productValidation(req.body)
        if(error) {
            errorHandler(error, res)
        }
        const {owner_id, category_id, name, description, price_per_day, is_active} = value

        if (price_per_day <= 0 ) {
            return res.status(400).json({
              success: false,
              message: "Narx musbat son bo'lishi kerak",
            });
          }

        const newProduct = await Products.create({owner_id, category_id, name, description, price_per_day, is_active})
        res.status(201).json({
            success: true,
            message: "Product muvaffaqiyatli yaratildi",
            newProduct,
          });
    } catch (error) {
        errorHandler(error, res)
    }

}

const findAllProducts = async (req, res) => {
    try {
        const products = await Products.findAll();
        res.status(200).json({
            success: true,
            count: products.length,
            products,
          });
    } catch (error) {
        errorHandler(error, res)
    }
}

const findByIdProduct = async (req, res) => {
    try {
        const {id} = req.params;
        const product = await Products.findByPk(id);
        if (!product) {
            return res.status(404).json({
              success: false,
              message: "Product topilmadi",
            });
          }
      
          res.status(200).json({
            success: true,
            product,
          });
    } catch (error) {
        errorHandler(error, res)
    }
}

const updateProduct = async (req, res) => {
    try {
        const {error, value} = productValidation(req.body)
        if(error) {
            errorHandler(error, res)
        }
        const {id} = req.params;
        const {owner_id, category_id, name, description, price_per_day, is_active} = value

        if (price_per_day <= 0 ) {
            return res.status(400).json({
              success: false,
              message: "Narx musbat son bo'lishi kerak",
            });
          }

          const [updated] = await Products.update(
            {owner_id, category_id, name, description, price_per_day, is_active},
            {
              where: { id: req.params.id },
            }
          );
      
          if (!updated) {
            return res.status(404).json({
              success: false,
              message: "Product topilmadi yoki yangilanmadi",
            });
          }
      
          const updatedProduct = await Products.findByPk(req.params.id);
      
          res.status(200).json({
            success: true,
            message: "Product muvaffaqiyatli yangilandi",
            product: updatedProduct,
          });
    } catch (error) {
        errorHandler(error, res)
    }
}

const deleteProduct = async (req, res) => {
    try {
        const deleted = await Products.destroy({
            where: { id: req.params.id },
          });
      
          if (!deleted) {
            return res.status(404).json({
              success: false,
              message: "Product topilmadi",
            });
          }
      
          res.status(200).json({
            success: true,
            message: "Product muvaffaqiyatli o'chirildi",
          });
    } catch (error) {
        errorHandler(error, res)
    }
}

module.exports = {
    addNewProduct,
    findAllProducts,
    findByIdProduct,
    updateProduct,
    deleteProduct
}