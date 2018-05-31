/**
 * 
 * Configuaration file
 */

//Container for all the enviroments
var enviroments = {}

enviroments.staging = {
  'httpPort': 3000,
  'httpsPort': 3001,
  'envName': 'staging'
}

enviroments.production = {
  'httpPort': 5000,
  'httpsPort': 5001,
  'envName': 'production'
}

//Determine wich one was passed in the comand line and export the correct enviroment
var currentEnviroment = typeof (process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : ''

//Check the envirmonet passed exist(default to satging)
var enviromentToExport = typeof (enviroments[currentEnviroment]) == 'object' ? enviroments[currentEnviroment] : enviroments.staging

//Export the module
module.exports = enviromentToExport