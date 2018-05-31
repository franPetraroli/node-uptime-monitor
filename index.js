/*
 *Primary file of the APi
 *
 *
 */

var http = require('http')
var https = require('https')
var fs = require('fs')
var url = require('url')
var StringDecoder = require('string_decoder').StringDecoder
var config = require('./config')
var _data = require('./lib/data')

//TESTING
// @TODO delete this after
_data.create('test', 'newFile', {
  'foo': 'bar'
}, (err) => {
  console.log('this was the error: ', err)
})


//Instantiating the HTTP server
var httpServer = http.createServer(function (req, res) {
  unifiedServer(req, res)
});

// Start HTTP server
httpServer.listen(config.httpPort, function () {
  console.log(`the server is listening on port ${config.httpPort} in config enviroment ${config.envName}`)
});

//Instantiating HTTPS server
var httpsServerOption = {
  'key': fs.readFileSync('./https/key.pem'),
  'cert': fs.readFileSync('./https/cert.pem')
}

var httpsServer = https.createServer(httpsServerOption, function (req, res) {
  unifiedServer(req, res)
});

//Start HTTPS server
httpsServer.listen(config.httpsPort, function () {
  console.log(`the server is listening on port ${config.httpsPort} in config enviroment ${config.envName}`)
});

//Define Handlers
var handlers = {}

//Smaple handler
handlers.ping = (data, callback) => {
  //Callback a hhtp status code, and a payload object
  callback(200)
}

//Smaple handler
handlers.notFound = (data, callback) => {
  callback(404)
}

//Define a request router
var router = {
  'ping': handlers.ping
}

//All the server logic
var unifiedServer = (req, res) => {
  //Get the URL and parse it
  var parsedUrl = url.parse(req.url, true)

  //Get the path
  var path = parsedUrl.pathname
  var trimmedPath = path.replace(/^\/+|\/+$/g, '')

  //Get query string as object
  var queryStringObject = JSON.stringify(parsedUrl.query)

  //Get the HTTP method
  var method = req.method.toLowerCase()

  // Get headers
  var headers = JSON.stringify(req.headers)

  //Get the payload if one
  var decoder = new StringDecoder('utf-8')
  var buffer = ''

  //As the data stream comes in it gets written and saved to buffer
  req.on('data', function (data) {
    buffer += decoder.write(data)
  })
  //When the request data stream ends
  req.on('end', () => {
    buffer += decoder.end()

    //Chose the handlershould go to or not found
    var chosendHandler = typeof (router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound

    //Construct the data object to send to the handler
    var data = {
      'trimmedPath': trimmedPath,
      'queryStringObject': queryStringObject,
      'method': method,
      'headers': headers,
      'payloads': buffer
    }

    //Route the request to the chosen handler
    chosendHandler(data, (statusCode, payload) => {
      //Use the status code called back or default to 200
      statusCode = typeof (statusCode) == 'numebr' ? statusCode : 200
      //Use the payload sent by user or deault to empty object
      payload = typeof (payload) == 'object' ? payload : {}

      //Convert the payload to a string
      var payloadString = JSON.stringify(payload)

      //Return the response
      res.setHeader('Content-Type', 'application/json')
      res.writeHead(statusCode)
      res.end(payloadString)

      //Send the request path
      console.log('Returning this response: ' + statusCode, payloadString)
    })
  })
}