const { createLogger, format, transports } = require("winston");
const { combine, timestamp, printf, json } = format;
const { Client } = require("pg");
const config = require("config");

function logToPostgres(level, message, timestamp) {
  const client = new Client({
    host: config.get("db_host"),
    port: config.get("db_port"),
    user: config.get("db_username"),
    password: config.get("db_password"),
    database: config.get("db_name"),
  });

  client.connect();

  const query = `INSERT INTO logs (level, message, timestamp) VALUES ($1, $2, $3)`;
  const values = [level, message, timestamp];

  client.query(query, values, (err, res) => {
    if (err) {
      console.error("Log yozishda xatolik:", err);
    }
    client.end();
  });
}

const myFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

const logger = createLogger({
  format: combine(timestamp(), myFormat, json()),
  transports: [
    new transports.Console({ level: "debug" }),
    new transports.File({ filename: "log/error.log", level: "error" }),
    new transports.File({ filename: "log/combined.log", level: "info" }),
  ],
});

logger.on("data", (log) => {
  logToPostgres(log.level, log.message, log.timestamp);
});

logger.exceptions.handle(
  new transports.File({ filename: "log/exceptions.log" })
);

logger.exitOnError = false;

module.exports = logger;
