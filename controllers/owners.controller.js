const { errorHandler } = require("../helpers/error_handler")
const Owners = require("../models/owners.model")
const bcrypt = require('bcrypt');
const { ownerValidation } = require("../validation/owner.validation");
const uuid = require('uuid');
const jwtServiceOwner = require("../services/jwtowner.service")
const config = require('config');
const mailService = require("../services/mail.service");


const addNewOwner =  async (req, res) => {
    try {
        const {error, value} = ownerValidation(req.body)
        if(error) {
             errorHandler(error, res)
        }
        const activation_link = uuid.v4()
        const {first_name, last_name, company_name, email, password, phone_number, address, registration_date, is_active} = value

        const checkOwner = await Owners.findOne({ where: { email } });
        if (checkOwner) {
            return res.status(400).json({
            success: false,
            message: "Bu email allaqachon ro'yxatdan o'tgan",
        });
        }

        const hashedPassword = bcrypt.hashSync(password, 7)
        const newOwner = await Owners.create({first_name, last_name, company_name, email, password: hashedPassword, phone_number, address, registration_date, activation_link, is_active})
        
        await mailService.sendActivationMail(
          newOwner.email,
          `${config.get("api_url")}/api/owners/activate/${activation_link}`
        );
        res.status(201).send({
          message:
            "Yangi User qo'shildi. Akkuntini Faolashtirish uchun pochtaga oting",
          newOwner,
        });
    } catch (error) {
        errorHandler(error, res)
    }

}

const findAllOwners = async (req, res) => {
    try {
        const owners = await Owners.findAll({
            attributes: { exclude: ["password", "refresh_token"] },
          });
      
          res.status(200).json({
            success: true,
            count: owners.length,
            owners,
          });
    } catch (error) {
        errorHandler(error, res)
    }
}

const findByIdOwner = async (req, res) => {
    try {
        const owner = await Owners.findByPk(req.params.id, {
            attributes: { exclude: ["password", "refresh_token"] },
          });
      
          if (!owner) {
            return res.status(404).json({
              success: false,
              message: "Foydalanuvchi topilmadi",
            });
          }
      
          res.status(200).json({
            success: true,
            owner,
          });
    } catch (error) {
        errorHandler(error, res)
    }
}

const updateOwner = async (req, res) => {
    try {
        const {error, value} = ownerValidation(req.body)
        if(error) {
            errorHandler(error, res)
        }
        const {id} = req.params;
        const {first_name, last_name, company_name, email, password, phone_number, address, registration_date} = value
        const updateData = {first_name, last_name, company_name, email, phone_number, address, registration_date}
        if (password) {
            updateData.password = bcrypt.hashSync(password, 7);
          }

          const [updated] = await Owners.update(updateData, {
            where: { id: req.params.id },
          });
      
          if (!updated) {
            return res.status(404).json({
              success: false,
              message: "Foydalanuvchi topilmadi",
            });
          }
      
          const updatedOwner = await Owners.findByPk(req.params.id, {
            attributes: { exclude: ["password", "refresh_token"] },
          });
      
          res.status(200).json({
            success: true,
            message: "Foydalanuvchi ma'lumotlari yangilandi",
            owner: updatedOwner,
          });
    } catch (error) {
        errorHandler(error, res)
    }
}

const deleteOwner = async (req, res) => {
    try {
        const deleted = await Owners.destroy({
            where: { id: req.params.id },
          });
      
          if (!deleted) {
            return res.status(404).json({
              success: false,
              message: "Foydalanuvchi topilmadi",
            });
          }
      
          res.status(200).json({
            success: true,
            message: "Foydalanuvchi muvaffaqiyatli o'chirildi",
          });
    } catch (error) {
        errorHandler(error, res)
    }
}

const loginOwner = async (req, res) => {
  try {
    const { email, password } = req.body;
    const owner = await Owners.findOne({ where: { email } });
    if (!owner) {
      return res.status(404).json({
        success: false,
        message: "Email yoki parol noto'g'ri",
      });
    }
    const validPassword = bcrypt.compareSync(password, owner.password);
    if (!validPassword) {
      return res.status(400).json({
        success: false,
        message: "Email yoki parol noto'g'ri",
      });
    }
    const payload = {
      id: owner.id,
      email: owner.email,
      is_active:owner.is_active,
    };
    const tokens = jwtServiceOwner.generateTokens(payload);
    await owner.update({ refresh_token: tokens.refreshToken });
    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      maxAge: config.get("refresh_cookie_time"),
    });

    res.status(200).json({
      success: true,
      message: "Tizimga muvaffaqiyatli kirdingiz",
      accessToken: tokens.accessToken,
      owner: {
        id: owner.id,
        name: owner.name,
        email: owner.email,
        phone_number: owner.phone_number,
      },
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const logoutOwner = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: "Siz avval tizimga kirmagansiz",
      });
    }

    await Owners.update(
      { refresh_token: null },
      { where: { refresh_token: refreshToken } }
    );

    res.clearCookie("refreshToken");
    res.status(200).json({
      success: true,
      message: "Muvaffaqiyatli chiqdingiz",
    });
  } catch (error) {
    errorHandler(error, res);
  }
};
const refreshTokenOwner = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Avval tizimga kirishingiz kerak",
      });
    }

    const decodedToken = await jwtServiceOwner.verifyRefreshToken(refreshToken);
    if (!decodedToken) {
      return res.status(403).json({
        success: false,
        message: "Yaroqsiz token",
      });
    }

    const client = await Owners.findOne({
      where: { refresh_token: refreshToken },
    });

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Foydalanuvchi topilmadi yoki avval tizimdan chiqib bo'lingan",
      });
    }

    const payload = {
      id: client.id,
      phone_number: client.phone_number,
      email: client.email,
    };

    const tokens = jwtServiceOwner.generateTokens(payload);

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

const activateOwnersAccount = async (req, res) => {
  try {
    const { link } = req.params;
    const owners = await Owners.findOne({ where: { activation_link: link } });

    if (!owners) {
      return res.status(400).send({ message: "Link notogri yoki eskirgan!" });
    }
    owners.is_active = true;
    owners.activation_link = null;
    await owners.save();
    res
      .status(200)
      .send({ message: "Akkaunt muvaffaqiyatli faollashtirildi!" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Serverda xatolik yuz berdi!" });
  }
};

module.exports = {
    addNewOwner,
    findAllOwners,
    findByIdOwner,
    updateOwner,
    deleteOwner,
    loginOwner,
    logoutOwner,
    refreshTokenOwner,
    activateOwnersAccount
    
}