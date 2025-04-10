const express = require("express");
const config = require("config");
const sequelize = require("./config/db")
const cookieParser = require('cookie-parser');

const PORT = config.get("port") || 3030;
const mainRouter = require("./routes/index.routes");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api", mainRouter);

app.listen(PORT, () => {
  console.log(`🚀 Server started at: http://localhost:${PORT}`);
});

async function start() {
  try {
    console.log("🔁 Connecting to database...");
    await sequelize.authenticate();
    console.log("✅ DB connected");

    await sequelize.sync({ alter: true });
    console.log("🔄 Tables synced");

    app.listen(PORT, () => {
      console.log(`🚀 Server started at: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log("❌ Error while starting the server:", error);
  }
}


start();
