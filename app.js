const express = require("express");
const config = require("config");
const sequelize = require("./config/db")
const cookieParser = require('cookie-parser');
const errorHandling = require("./middleware/errors/error.handling")

const PORT = config.get("port") || 3030;
const mainRouter = require("./routes/index.routes");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api", mainRouter);

app.use(errorHandling)

async function start() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });

    app.listen(PORT, () => {
      console.log(`Server started at: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log("Error while starting the server:", error);
  }
}


start();
