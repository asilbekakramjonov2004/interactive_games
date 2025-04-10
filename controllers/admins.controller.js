const { errorHandler } = require("../helpers/error_handler")
const Admins = require("../models/admins.model")
const bcrypt = require('bcrypt');
const { adminValidation } = require("../validation/admin.validation");
const jwtServiceAdmin = require("../services/jwtadmin.service");
const config = require('config');
const logger = require("../services/logger.service")


const addNewAdmin =  async (req, res) => {
    try {
        const {error, value} = adminValidation(req.body)
        if(error) {
            errorHandler(error, res)
        }
        const {name, email, password, phone_number, is_active, is_creator} = value

        const checkAdmin = await Admins.findOne({where: {email}});
        if(checkAdmin){
            return res.status(400).send({message: "Bu email avval ro'yxatdan o'tgan"})
        }
        const hashedPassword = bcrypt.hashSync(password, 7)
        const newAdmin = await Admins.create({name, email, password: hashedPassword, phone_number, is_active, is_creator})
        res.status(201).send({message: "New admin added", newAdmin})
        logger.info("Yangi admin yaratildi",newAdmin)
    } catch (error) {
        logger.error("Error createng admin" +error.message)
        errorHandler(error, res)
    }

}

const findAllAdmins = async (req, res) => {
    try {
        const admins = await Admins.findAll({attributes: {exclude: ["password", "refresh_token"]}});
        res.status(200).send({admins})
    } catch (error) {
        errorHandler(error, res)
    }
}

const findByIdAdmin = async (req, res) => {
    try {
        const {id} = req.params;
        const admin = await Admins.findByPk(id);
        if (!admin) {
            return res.status(404).json({
              success: false,
              message: "Admin topilmadi",
            });
          }
      
        res.status(200).send({admin})
    } catch (error) {
        errorHandler(error, res)
    }
}

const updateAdmin = async (req, res) => {
    try {
        const {error, value} = adminValidation(req.body)
        if(error) {
            errorHandler(error, res)
        }
        const {id} = req.params
        const {name, email, password_hash, phone_number, is_active, is_creator} = value
        const updateData = {name, email, phone_number, is_active, is_creator}
        if (password_hash) {
            updateData.password = bcrypt.hashSync(password_hash, 10);
          }
          const [updated] = await Admins.update(updateData, {
            where: { id: req.params.id },
          });
          if (!updated) {
            return res.status(404).json({
              success: false,
              message: "Admin topilmadi",
            });
          }

        const updatedAdmin = await Admins.findByPk(req.params.id, {
            attributes: { exclude: ["password", "refresh_token"] },
          }
        );
        res.json({
            success: true,
            message: "Admin ma'lumotlari yangilandi",
            admin: updatedAdmin,
          });
    } catch (error) {
        errorHandler(error, res)
    }
}

const deleteAdmin = async (req, res) => {
    try {
        const deleted = await Admins.destroy({
            where: { id: req.params.id },
          });
      
          if (!deleted) {
            return res.status(404).json({
              success: false,
              message: "Admin topilmadi",
            });
          }
      
          res.json({
            success: true,
            message: "Admin muvaffaqiyatli o'chirildi",
          });
    } catch (error) {
        errorHandler(error, res)
    }
}

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admins.findOne({ where: { email } });
    
    if (!admin) {
      return res.status(400).send({ message: "email yoki parol xato!" });
    }

    const validPassword = await bcrypt.compare(password, admin.password);
    if (!validPassword) {
      return res.status(400).send({ message: "email yoki parol xato!" });
    }

    const payload = {
      id: admin.id,
      phone_number: admin.phone_number,
      email: admin.email,
      is_creator: admin.is_creator,
      is_active: admin.is_active,
    };
    const token = jwtServiceAdmin.generateTokens(payload);

    await admin.update({ refresh_token: token.refreshToken });

    res.cookie("refreshToken", token.refreshToken, {
      httpOnly: true,
      maxAge: config.get("refresh_cookie_time"),
    });

    res.status(200).send({
      message: "Tizimga xush kelibsiz!",
      accessToken: token.accessToken,
      admin: {
        id: admin.id,
        first_name: admin.first_name,
        last_name: admin.last_name,
        phone_number: admin.phone_number,
        email: admin.email,
      },
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const logoutAdmin = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: "Siz birinchi martta tizimga kirishingiz",
      });
    }

    await Admins.update(
      { refresh_token: null },
      { where: { refresh_token: refreshToken } }
    );

    res.clearCookie("refreshToken");
    res.json({
      success: true,
      message: "Chiqish muvaffaqiyatli otdi",
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const refreshTokenAdmin = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Avval tizimga kiring",
      });
    }

    const decodedToken = await jwtServiceAdmin.verifyRefreshToken(refreshToken);
    if (!decodedToken) {
      return res.status(403).json({
        success: false,
        message: "Yaroqsiz token",
      });
    }

    const admin = await Admins.findOne({
      where: { refresh_token: refreshToken },
    });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Foydalanuvchi topilmadi yoki tizimdan chiqib ketgan",
      });
    }

    const payload = {
      id: admin.id,
      phone_number: admin.phone_number,
      email: admin.email,
      role: admin.is_creator,
    };

    const tokens = jwtServiceAdmin.generateTokens(payload);

    await admin.update({ refresh_token: tokens.refreshToken });

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      maxAge: config.get("refresh_cookie_time"),
    });

    res.status(200).json({
      success: true,
      message: "Tokenlar yangilandi",
      accessToken: tokens.accessToken,
      admin: {
        id: admin.id,
        first_name: admin.first_name,
        last_name: admin.last_name,
        phone_number: admin.phone_number,
        email: admin.email,
      },
    });
  } catch (error) {
    errorHandler(error, res);
  }
};
module.exports = {
    addNewAdmin,
    findAllAdmins,
    findByIdAdmin,
    updateAdmin,
    deleteAdmin,
    loginAdmin,
    logoutAdmin,
    refreshTokenAdmin,
}