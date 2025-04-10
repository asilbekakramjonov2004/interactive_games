const { errorHandler } = require("../helpers/error_handler")
const Contracts = require("../models/contracts.model")
const bcrypt = require('bcrypt');
const { contractValidation } = require("../validation/contract.validation");


const addNewContract =  async (req, res) => {
    try {
        const {error, value} = contractValidation(req.body)
        if(error) {
            errorHandler(error, res)
        }
        const {client_id, product_id, start_date, end_date, status_id, created_at, tarif_id, total_amount} = value
        const startDate = new Date(start_date);
        const endDate = new Date(end_date);
        
        if (startDate >= endDate) {
            return res.status(400).json({
              success: false,
              message: "Tugash sanasi boshlanish sanasidan keyin bo'lishi kerak",
            });
          }

        const newContract = await Contracts.create({client_id, product_id, start_date: startDate, end_date: endDate, status_id, created_at, tarif_id, total_amount})
        res.status(201).send({message: "New contract added", newContract})
    } catch (error) {
        errorHandler(error, res)
    }

}

const findAllContracts = async (req, res) => {
    try {
        const contracts = await Contracts.findAll();
        res.status(200).send({contracts})
    } catch (error) {
        errorHandler(error, res)
    }
}

const findByIdContract = async (req, res) => {
    try {
        const { id } = req.params;
    const contract = await Contracts.findByPk(id);

    if (!contract) {
      return res.status(404).json({ message: "Contract not found" });
    }

    res.status(200).json(contract);
    } catch (error) {
        errorHandler(error, res)
    }
}

const updateContract = async (req, res) => {
    try {
        const {error, value} = contractValidation(req.body)
        if(error) {
            errorHandler(error, res)
        }
        const {id} = req.params;
        const {client_id, product_id, start_date, end_date, status_id, created_at, tarif_id, total_amount} = value

        const contract = await Contracts.findByPk(id);
            if (!contract) {
        return res.status(404).json({ message: "Contract not found" });
        }

        await contract.update({client_id, product_id, start_date, end_date, status_id, created_at, tarif_id, total_amount});
        res.status(200).json({ message: "Contract updated", contract });

    } catch (error) {
        errorHandler(error, res)
    }
}

const deleteContract = async (req, res) => {
    try {
        const { id } = req.params;
        const contract = await Contracts.findByPk(id);
        if (!contract) {
        return res.status(404).json({ message: "Contract not found" });
            }
        await contract.destroy();
        res.status(200).json({ message: "Contract deleted" });
    } catch (error) {
        errorHandler(error, res)
    }
}

module.exports = {
    addNewContract,
    findAllContracts,
    findByIdContract,
    updateContract,
    deleteContract
}