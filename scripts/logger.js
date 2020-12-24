const config = require('../config.js');
const bot = require('../package.json')
const colors = require('colors')
/**
 * Logging core functionalities
 * @param {String}  logMessage  The message to be logged
 */
module.exports.info = function(logMessage) {
    if (config.LOG_LEVEL === 'INFO' || config.LOG_LEVEL === 'DEBUG') { console.info(`=== ${bot.name.america} ${logMessage.yellow} ===`) } // Checking for debug level
};

/**
 * Advanced logging
 * @param {String}  functonName The name of the function to be logged
 * @param {String}  logMessage  The message to be logged
 */
module.exports.debug = function(functionName, logMessage = 'None') {
    if (config.LOG_LEVEL === 'DEBUG') { console.info(`>>> ${functionName.blue} | ${logMessage.yellow} <<<`) } // Checking to make sure advanced logging is enabled
};

/**
 * Error logging
 * @param {String}  functonName     The name of the function calling an error
 * @param {String}  errorMessage    The error message to be logged
 */
module.exports.error = function(functionName, errorMessage) {
    console.error(`>>> ${functionName} | ${errorMessage} <<<`.red);
};