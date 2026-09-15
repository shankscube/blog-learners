const { response } = require("express");
const fs = require("fs");
const path = require("path");

const logsDirectory = path.join(__dirname, "../logs");

// Create logs directory if it doesn't exist
if (!fs.existsSync(logsDirectory)) {
  fs.mkdirSync(logsDirectory, {
    recursive: true,
  });
}

const appLogFile = path.join(logsDirectory, "app.log");
const errorLogFile = path.join(logsDirectory, "error.log");
const postLogFile = path.join(logsDirectory, "input-data.log");

const getTimestamp = () => {
  return new Date().toISOString();
};

const formatMessage = (level, message, data = null) => {
  let logMessage = `[${getTimestamp()}] [${level.toUpperCase()}] ${message}`;

  if (data) {
    logMessage += ` ${JSON.stringify(data)}`;
  }

  return logMessage + "\n";
};

const writeLog = (level, message, data = null) => {
  const formattedMessage = formatMessage(level, message, data);

  // Write all logs to app.log
  fs.appendFile(appLogFile, formattedMessage, (error) => {
    if (error) {
      console.error("Failed to write app log:", error);
    }
  });

  // Write errors separately to error.log
  if (level.toLowerCase() === "error") {
    fs.appendFile(errorLogFile, formattedMessage, (error) => {
      if (error) {
        console.error("Failed to write error log:", error);
      }
    });
  }
  //show logs in terminal
  console.log(formattedMessage.trim());
};

const info = (message, data = null) => {
  writeLog("info", message, data);
};

const warn = (message, data = null) => {
  writeLog("warn", message, data);
};

const error = (message, data = null) => {
  writeLog("error", message, data);
};

const debug = (message, data = null) => {
  writeLog("debug", message, data);
};

// POST Request Logger Middleware

const postLogger = (request, response, next) => {
  // Only handle POST requests
  if (request.method !== "POST") {
    return next();
  }

  const startTime = Date.now();

  response.on("finish", () => {
    const duration = Date.now() - startTime;

    // Copy request body
    const requestBody = {
      ...request.body,
    };

    // Remove sensitive data
    if (requestBody.password) {
      requestBody.password = "[REDACTED]";
    }

    if (requestBody.password_hash) {
      requestBody.password_hash = "[REDACTED]";
    }

    const postLogData = {
      timestamp: getTimestamp(),
      method: request.method,
      url: request.originalUrl,
      statusCode: response.statusCode,
      duration: `${duration}ms`,
      ip: request.ip,
      body: requestBody,
    };

    const formattedPostLog =
      JSON.stringify(postLogData, null, 2) +
      "\n--------------------------------------------------\n";

    fs.appendFile(postLogFile, formattedPostLog, (error) => {
      if (error) {
        console.error("Failed to write POST log:", error);
      }
    });
    console.log("[POST LOG]", postLogData);
  });

  next();
};

module.exports = {
  info,
  warn,
  error,
  debug,
  postLogger,
};
