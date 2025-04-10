const { errorHandler } = require("../helpers/error_handler")
const Clients = require("../models/clients.model")
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const { clientValidation } = require("../validation/client.validation");
const jwtServiceClient = require("../services/jwtclients.service");
const config = require('config');
const mailService = require("../services/mail.service");


const addNewClient =  async (req, res) => {
    try {
        const {error, value} = clientValidation(req.body)
        if(error) {
            errorHandler(error, res)
        }
        const activation_link = uuid.v4()
        const {first_name, last_name, email, password, phone_number, passport, address, registration_date, is_active} = value

        const hashedPassword = bcrypt.hashSync(password, 7)
        const newClient = await Clients.create({first_name, last_name, email, password: hashedPassword, phone_number, passport, address, registration_date, activation_link, is_active})
       
        await mailService.sendActivationMail(
            newClient.email,
            `${config.get("api_url")}/api/clients/activate/${activation_link}`
          );
          res.status(201).send({
            message:
              "Yangi User qo'shildi. Akkuntini Faolashtirish uchun pochtaga oting",
            newClient,
          });
    } catch (error) {
        errorHandler(error, res)
    }

}

const findAllClients = async (req, res) => {
    try {
        const clients = await Clients.findAll();
        res.status(200).send({clients})
    } catch (error) {
        errorHandler(error, res)
    }
}

const findByIdClient = async (req, res) => {
    try {
        const {id} = req.params;
        const client = await Clients.findByPk(id);
        if (!client) {
            return res.status(404).send({ message: "Client not found with this ID" });
          }
        res.status(200).send({client})
    } catch (error) {
        errorHandler(error, res)
    }
}

const updateClient = async (req, res) => {
    try {
        const {error, value} = clientValidation(req.body)
        if(error) {
            errorHandler(error, res)
        }
        const {id} = req.params;
        const {first_name, last_name, email, password, phone_number, passport, address, registration_date, is_active} = value

        if (password) {
            const hashedPassword = bcrypt.hashSync(password, 7);
            value.password = hashedPassword;
          }
      
          const [updates] = await Clients.update(value, {
            where: { id: req.params.id },
          });
      
          if (updates === 0) {
            return res
              .status(404)
              .send({ message: "Client not found or not updated" });
          }

        const updatedClient = await Clients.findByPk(id);
        res.status(200).send({message: "Client updated", client: updatedClient})
    } catch (error) {
        errorHandler(error, res)
    }
}

const deleteClient = async (req, res) => {
    try {
        const deletedCount = await Clients.destroy({
            where: { id: req.params.id },
          });
      
          if (deletedCount === 0) {
            return res.status(404).send({ message: "Client not found" });
          }
      
          res.status(200).send({ message: "Client deleted successfully" });
    } catch (error) {
        errorHandler(error, res)
    }
}

const loginClient = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      const client = await Clients.findOne({ where: { email } });
  
      if (!client) {
        return res.status(400).send({ message: "email yoki parol xato!" });
      }
  
      const validPassword = await bcrypt.compare(password, client.password);
      if (!validPassword) {
        return res.status(400).send({ message: "email yoki parol xato!" });
      }
  
      const payload = {
        id: client.id,
        phone_number: client.phone_number,
        email: client.email,
        is_active: client.is_active,
      };
      const token = jwtServiceClient.generateTokens(payload);
  
      await client.update({ refresh_token: token.refreshToken });
  
      res.cookie("refreshToken", token.refreshToken, {
        httpOnly: true,
        maxAge: config.get("refresh_cookie_time"),
      });
  
      res.status(200).send({
        message: "Tizimga xush kelibsiz!",
        accessToken: token.accessToken,
        client: {
          id: client.id,
          first_name: client.first_name,
          last_name: client.last_name,
          phone_number: client.phone_number,
          email: client.email,
        },
      });
    } catch (error) {
      errorHandler(error, res);
    }
  };
  const logoutClient = async (req, res) => {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        return res.status(400).json({
          message: "Refresh token topilmadi",
        });
      }
  
      const [updatedCount] = await Clients.update(
        { refresh_token: null },
        { where: { refresh_token: refreshToken } }
      );
  
      if (updatedCount === 0) {
        return res.status(404).json({
          message: "Bunday token bilan client topilmadi",
        });
      }
  
      res.clearCookie("refreshToken");
  
      res.status(200).json({
        message: "Client muvaffaqiyatli tizimdan chiqdi",
      });
    } catch (error) {
      console.error("Chiqish xatosi:", error);
      errorHandler(error, res);
    }
  };
  const refreshClientToken = async (req, res) => {
    try {
      const refreshToken = req.cookies.refreshToken;
  
      if (!refreshToken) {
        return res.status(401).json({
          success: false,
          message: "Avval tizimga kiring",
        });
      }
  
      const decodedToken = await jwtServiceClient.verifyRefreshToken(refreshToken);
      if (!decodedToken) {
        return res.status(403).json({
          success: false,
          message: "Yaroqsiz token",
        });
      }
  
      const client = await Clients.findOne({
        where: { refresh_token: refreshToken },
      });
  
      if (!client) {
        return res.status(404).json({
          success: false,
          message: "Foydalanuvchi topilmadi yoki avval tizimdan chiqgan",
        });
      }
  
      const payload = {
        id: client.id,
        phone_number: client.phone_number,
        email: client.email,
      };
  
      const tokens = jwtServiceClient.generateTokens(payload);
  
      await client.update({ refresh_token: tokens.refreshToken });
  
      res.cookie("refreshToken", tokens.refreshToken, {
        httpOnly: true,
        maxAge: config.get("refresh_cookie_time"),
      });
  
      res.status(200).json({
        success: true,
        message: "Tokenlar muvaffaqiyatli yangilandi",
        accessToken: tokens.accessToken,
        client: {
          id: client.id,
          first_name: client.first_name,
          last_name: client.last_name,
          phone_number: client.phone_number,
          email: client.email,
        },
      });
    } catch (error) {
      errorHandler(error, res);
    }
  };
  const activateClientAccount = async (req, res) => {
    try {
      const { link } = req.params;
      const clients = await Clients.findOne({ where: { activation_link: link } });
  
      if (!clients) {
        return res.status(400).send({ message: "Link notogri yoki eskirgan!" });
      }
      clients.is_active = true;
      clients.activation_link = null;
      await clients.save();
      res
        .status(200)
        .send({ message: "Akkaunt muvaffaqiyatli faollashtirildi!" });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Serverda xatolik yuz berdi!" });
    }
  };

module.exports = {
    addNewClient,
    findAllClients,
    findByIdClient,
    updateClient,
    deleteClient,
    loginClient,
    logoutClient,
    refreshClientToken,
    activateClientAccount
}