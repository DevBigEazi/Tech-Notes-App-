const path = require("path");
const fs = require("fs");
const fsPromises = require("fs/promises");

const { format } = require("date-fns");
const { v4: uuid } = require("uuid");

const logEvents = async (message, logName) => {
  const dateTime = format(new Date(), "yyyy-MM-dd\t\tHH:mm:ss");
  const logItems = `${dateTime}\t${uuid()}\t ${message} \n`;
  console.log(logItems);
  try {
    if (!fs.existsSync(path.join(__dirname, "..", "logs"))) {
      await fsPromises.mkdir(path.join(__dirname, "..", "logs"));
    }
    await fsPromises.appendFile(
      path.join(__dirname, "..", "logs", logName),
      logItems
    );
  } catch (err) {
    console.log(err);
  }
};

const logger = (req, res, next) => {
  logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, "reqLog.txt");
  console.log(`${req.method}\n${req.path}`);
  next();
};

module.exports = { logger, logEvents };
