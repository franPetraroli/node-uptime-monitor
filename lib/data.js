/*
 *Library to store and editing data 
 * 
 * 
 * 
 */

//Dependecies
var fs = require('fs')
var path = require('path')

// Container for the module to be exported
var lib = {}

// Base directory for the data folder
lib.baseDir = path.join(__dirname, '/../.data/')

// Write data to a file
lib.create = function (dir, file, data, callback) {
  // Open the file for writing
  fs.open(lib.baseDir + dir + '/' + '.json', 'wx', (err, fileDescriptor) => {
    if (!err && fileDescriptor) {
      // Convert data to string
      var stringData = JSON.stringify(data)

      // Write to filed and close it
      fs.writeFile(fileDescriptor, stringData, (err) => {
        if (!err) {
          fs.close(fileDescriptor, (err) => {
            if (!err) {
              callback(false)
            } else {
              callback('Error closing the new file')
            }
          })
        } else {
          callback('Error writing the new file')
        }
      })
    } else {
      callback('Could not create a new file, it ')
    }
  })

}

lib.read = (dir, file, callback) => {
  fs.readFile(lib.baseDir + dir + '/' + file + '.json', 'utf-8', (err, data) => {
    callback(err, data)
  })
}

lib.update = (dir, file, data, callback) => {
  fs.open(lib.baseDir + dir + '/' + file + '.json', 'r+', (err, fileDescriptor) => {
    if (!err && fileDescriptor) {
      // Convert data to string
      var stringData = JSON.stringify(data)

      //Truncate the file
      fs.ftruncate(fileDescriptor, (err) => {
        if (!err) {
          // Write to the file and close it
          fs.writeFile(fileDescriptor, stringData, (err) => {
            if (!err) {
              fs.close(fileDescriptor, (err) => {
                if (!err) {
                  callback(false)
                } else {
                  callback('Error closing the existing file' + err)
                }
              })
            }
          })
        }
      })
      fs
    } else {
      callback('Could not open the file, it may not exist')
    }
  })
}

lib.delete = (dir, file, callback) => {
  fs.unlink(lib.baseDir + dir + '/' + file + '.json', (err) => {
    if (!err) {
      callback(false)
    } else {
      callback('Error deleting file')
    }
  })
}

module.exports = lib