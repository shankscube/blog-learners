const fs = require('fs');
const path = require('path');

const getLogFilePath = () => {
    const logDir = path.join(process.cwd(), 'src/storage/logs');
    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
    }
    const date = new Date().toISOString().split('T')[0];
    return path.join(logDir, `logs_${date}.log`);
};

const getCustomLogFilePath = (customname) => {
    const logDir = path.join(process.cwd(), 'src/storage/logs');
    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
    }
    const date = new Date().toISOString().split('T')[0];
    return path.join(logDir, `${customname}_${date}.log`);
}

exports.writeLog = (message, type = 'INFO', customname='') => {
    try {
        let logFile = getLogFilePath();
        if (type === 'CUSTOM') {
            logFile = getCustomLogFilePath(customname);
        }
        
        fs.appendFileSync(logFile, `${new Date().toISOString()} ${message}`);
    } catch (error) {
        console.error("Failed to write to log file:", error);
    }
};
